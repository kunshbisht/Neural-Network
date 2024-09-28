import tensorflow as tf
import numpy as np
import json

# Load the MNIST dataset
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()

# Flatten the 28x28 images into 1D arrays (784 values)
x_train_flattened = x_train.reshape(-1, 28 * 28).astype(float)
x_test_flattened = x_test.reshape(-1, 28 * 28).astype(float)

# Normalize pixel values (0 to 1)
x_train_flattened /= 255.0
x_test_flattened /= 255.0

# Convert to list of dictionaries with data and label
mnist_data = [{"data": img.tolist(), "label": int(label)} for img, label in zip(x_train_flattened, y_train)]

# Save to JSON file
with open('mnist_train.json', 'w') as json_file:
    json.dump(mnist_data, json_file)

print("MNIST data saved to mnist_train.json")