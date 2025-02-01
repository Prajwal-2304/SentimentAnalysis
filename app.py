from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from transformers import DebertaTokenizer, TFDebertaForSequenceClassification,AutoTokenizer

app = Flask(__name__)
CORS(app) 
model = TFDebertaForSequenceClassification.from_pretrained('microsoft/deberta-base',num_labels=3)
tokenizer = DebertaTokenizer.from_pretrained('microsoft/deberta-base')
model.load_weights(r'smodel1.h5')
@app.route('/classify', methods=['POST'])
def classify_text():
    data = request.json
    texts = data['texts']
    
    positive = []
    neutral = []
    negative = []

    for text in texts:
        sentence = text
        text = tokenizer(text, return_tensors='tf')
        tfeature = {
            'input_ids': text['input_ids'],
            'attention_mask': text['attention_mask']
        }
        logits = model(tfeature)[0]
        ind = tf.argmax(logits, axis=1).numpy()[0]
        if ind == 0:
            negative.append(sentence)
        elif ind == 1:
            neutral.append(sentence)
        else:
            positive.append(sentence)

    return jsonify({
        'positive': positive,
        'neutral': neutral,
        'negative': negative
    })

if __name__ == '__main__':
    app.run(debug=True)
