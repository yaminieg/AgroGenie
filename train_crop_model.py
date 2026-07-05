import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv("crop_dataset.csv")

# Features and target
X = df.drop("Crop", axis=1)

#Comvert crop names to numbers
encoder = LabelEncoder()
y = encoder.fit_transform(df["Crop"])

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100,random_state=42)
model.fit(X_train, y_train)

#Predict on test data
y_pred = model.predict(X_test)

# Check accuracy
accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy * 100:.2f}%")

# Save model
joblib.dump(model, "crop_model.pkl")
joblib.dump(encoder, "crop_label_encoder.pkl")

print("Model saved successfully!")
print("Label Encoder saved successfully!")