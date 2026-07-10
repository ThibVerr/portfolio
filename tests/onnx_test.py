import os
import cv2
import numpy as np
import mediapipe as mp
import onnxruntime as ort
# ...existing code...
# Debug / robust loading
print("mediapipe module file:", getattr(mp, "__file__", "<builtin>"))
if not hasattr(mp, "solutions"):
    raise RuntimeError("mediapipe package missing 'solutions'. Check for a local 'mediapipe.py' or folder shadowing the real package.")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "gesture_mlp.onnx")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"ONNX model not found at {MODEL_PATH} — place gesture_mlp.onnx in the tests/ folder or update the path.")

session = ort.InferenceSession(MODEL_PATH)
input_name = session.get_inputs()[0].name

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1)

def normalize(hand):
    pts = np.array([[lm.x, lm.y, lm.z] for lm in hand.landmark], dtype=np.float32)
    pts -= pts[0]                  # Wrist at origin
    scale = np.linalg.norm(pts[9]) # Middle MCP
    if scale > 0:
        pts /= scale
    return pts.flatten().reshape(1, -1)

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)

    if result.multi_hand_landmarks:
        hand = result.multi_hand_landmarks[0]

        x = normalize(hand).astype(np.float32)

        logits = session.run(None, {input_name: x})[0]

        probs = np.exp(logits)
        probs /= probs.sum(axis=1, keepdims=True)

        pred = np.argmax(probs)
        conf = probs[0, pred]

        cv2.putText(
            frame,
            f"{CLASS_NAMES[pred]} ({conf:.2f})",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2,
        )

        mp.solutions.drawing_utils.draw_landmarks(
            frame,
            hand,
            mp_hands.HAND_CONNECTIONS,
        )

    cv2.imshow("Gesture Test", frame)

    if cv2.waitKey(1) == 27:  # ESC to quit
        break

cap.release()
cv2.destroyAllWindows()