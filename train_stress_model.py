import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Load Dataset
df = pd.read_csv("crop_stage_dataset.csv")

# Encode Categorical Columns
crop_encoder = LabelEncoder()
df["Crop"] = crop_encoder.fit_transform(df["Crop"])

stage_encoder = LabelEncoder()
df["Growth_Stage"] = stage_encoder.fit_transform(df["Growth_Stage"])

stress_encoder = LabelEncoder()
df["Stress_Class"] = stress_encoder.fit_transform(df["Stress_Class"])

# Input Features
X = df[
    [
        "Crop",
        "Growth_Stage",
        "NDVI",
        "EVI",
        "NDWI",
        "SAVI",
        "Soil_Moisture",
        "Temperature_C",
        "Rainfall_mm",
        "ET_mm_day"
    ]
]

# Target
y = df["Stress_Class"]

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Train Model
model = RandomForestClassifier(
    n_estimators=300,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, pred))
print(classification_report(y_test, pred))

# Save
joblib.dump(model, "stress_model.pkl")
joblib.dump(crop_encoder, "stress_crop_encoder.pkl")
joblib.dump(stage_encoder, "stress_stage_encoder.pkl")
joblib.dump(stress_encoder, "stress_label_encoder.pkl")

print("Stress Model Saved Successfully!")