from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///banco.db'
db = SQLAlchemy(app)

# Configura o CORS
CORS(app, origins=['http://127.0.0.1:5500'])

# Classe de Produto
class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80), nullable=False)
    preco = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'preco': self.preco,
        }

with app.app_context():
    db.create_all()

@app.route('/produtos', methods=['GET'])
def get_produtos():
    produtos = Produto.query.all()
    return jsonify([produto.serialize() for produto in produtos])

@app.route('/produtos/<int:produto_id>', methods=['GET'])
def get_produto(produto_id):
    produto = Produto.query.get(produto_id)
    if produto is None:
        return jsonify({'mensagem': 'Produto não encontrado'}), 404
    return jsonify(produto.serialize())

@app.route('/produtos', methods=['POST'])
def create_produto():
    dados = request.get_json()
    nome = dados.get('nome')
    preco = dados.get('preco')

    if not nome or preco is None:
        return jsonify({'mensagem': 'Dados incompletos!'}), 400

    novo_produto = Produto(nome=nome, preco=preco)
    db.session.add(novo_produto)
    db.session.commit()

    return jsonify(novo_produto.serialize()), 201

@app.route('/produtos/<int:produto_id>', methods=['PUT'])
def update_produto(produto_id):
    dados = request.get_json()
    produto = Produto.query.get(produto_id)

    if produto is None:
        return jsonify({'mensagem': 'Produto não encontrado'}), 404

    produto.nome = dados.get('nome', produto.nome)
    produto.preco = dados.get('preco', produto.preco)
    db.session.commit()

    return jsonify(produto.serialize())

@app.route('/produtos/<int:produto_id>', methods=['DELETE'])
def delete_produto(produto_id):
    produto = Produto.query.get(produto_id)
    if produto is None:
        return jsonify({'mensagem': 'Produto não encontrado'}), 404

    db.session.delete(produto)
    db.session.commit()

    return jsonify({'mensagem': 'Produto excluído com sucesso'}), 200

if __name__ == '__main__':
    app.run(debug=True)