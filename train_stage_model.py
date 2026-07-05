import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report

# Load dataset
df = pd.read_csv("crop_stage_dataset.csv")

# Encode Crop
crop_encoder = LabelEncoder()
df['Crop'] = crop_encoder.fit_transform(df['Crop'])


# Input features
X = df[
    [
        "Crop",
        "NDVI",
        "EVI",
        "Soil_Moisture",
        "Temperature_C",
        "Rainfall_mm",
        "ET_mm_day"
    ]
]

# Target column
y = df["Growth_Stage"]

# Encode labels
stage_label_encoder = LabelEncoder()
y_encoded = stage_label_encoder.fit_transform(y)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Test accuracy
y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# Save model and encoder
joblib.dump(model, "stage_model.pkl")
joblib.dump(stage_label_encoder, "stage_label_encoder.pkl")
joblib.dump(crop_encoder,"stage_crop_encoder.pkl")

print("\nModel saved as stage_model.pkl")
print("Encoder saved as stage_label_encoder.pkl, stage_crop_encoder.pkl")