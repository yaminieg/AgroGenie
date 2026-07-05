from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import joblib

df = pd.read_csv("crop_stage_dataset.csv")
df = df.fillna(0)

# Encode Crop
crop_encoder = LabelEncoder()
df["Crop"] = crop_encoder.fit_transform(df["Crop"])

# Encode Stage
stage_encoder = LabelEncoder()
df["Growth_Stage"] = stage_encoder.fit_transform(df["Growth_Stage"])

# Check dataset
print(df.head())
print(df.dtypes)
print(df.isnull().sum())

X = df[
    [
    "Crop",
    "NDVI",
    "EVI",
    "NDWI",
    "SAVI",
    "Soil_Moisture",
    "Temperature_C",
    "Rainfall_mm",
    "ET_mm_day",
    "Growth_Stage"
    ]
]
y = df["Water_Req_mm"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

joblib.dump(model, "water_model.pkl")
joblib.dump(crop_encoder, "water_crop_encoder.pkl")
joblib.dump(stage_encoder, "water_stage_encoder.pkl")