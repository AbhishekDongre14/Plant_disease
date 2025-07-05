import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function App() {
  const [image, setImage] = useState<any>(null);
  const [prediction, setPrediction] = useState<{ class: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus.status !== 'granted' || mediaStatus.status !== 'granted') {
        Alert.alert('Permission Required', 'Camera and gallery access is required.');
      }
    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setPrediction(null);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setPrediction(null);
    }
  };

  const predict = async () => {
    if (!image) return;

    setLoading(true);
    const uri = image.uri;

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'plant.jpg',
    } as any);

    try {
      const res = await axios.post('http://192.168.1.107:8000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPrediction(res.data);
    } catch (err: any) {
      console.error('Prediction failed:', err.message);
      setPrediction({ class: 'Error', confidence: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌿 Plant Disease Predictor</Text>

      <View style={styles.buttonGroup}>
        <Button title="📸 Take Photo" onPress={takePhoto} />
        <View style={{ height: 10 }} />
        <Button title="🖼️ Upload Image" onPress={pickFromGallery} />
      </View>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.image} resizeMode="contain" />
      )}

      {image && (
        <Button title="🔍 Predict" onPress={predict} color="#4CAF50" />
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {prediction && (
        <View style={styles.result}>
          <Text style={styles.resultText}>Detected Class: {prediction.class}</Text>
          <Text style={styles.resultText}>
            Confidence: {(prediction.confidence * 100).toFixed(2)}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 250, height: 250, marginVertical: 20, borderRadius: 12 },
  buttonGroup: { marginVertical: 10 },
  result: { marginTop: 20, alignItems: 'center' },
  resultText: { fontSize: 18, fontWeight: '600', marginTop: 5 },
});
