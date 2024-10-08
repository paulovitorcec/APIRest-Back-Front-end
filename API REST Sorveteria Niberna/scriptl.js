document.addEventListener('DOMContentLoaded', function() {

    const produtosList = document.getElementById('produtos-list');
  
    document.getElementById('produto-form').addEventListener('submit', function (e) {
        e.preventDefault(); 
  
        const nome = document.getElementById('nome').value;
        const preco = parseFloat(document.getElementById('preco').value);
  
        fetch('http://127.0.0.1:5000/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, preco })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Produto adicionado:', data);
            listarProdutos();
        })
        .catch(error => {
            console.error('Erro ao adicionar produto:', error);
            alert('Erro ao adicionar o produto. Tente novamente.');
        });
    });
  
    function listarProdutos() {

        fetch('http://127.0.0.1:5000/produtos')
        .then(response => response.json())
        .then(produtos => {
            produtosList.innerHTML = '';
  
            produtos.forEach(produto => {
                const row = document.createElement('tr');
  
                row.innerHTML = `
                    <td>${produto.nome}</td>
                    <td>R$ ${produto.preco.toFixed(2)}</td>
                    <td>
                        <button class="button edit-button" onclick="editarProduto(${produto.id})">Editar</button>
                        <button class="button delete-button" onclick="excluirProduto(${produto.id})">Excluir</button>
                    </td>
                `;
  
                produtosList.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro ao listar produtos:', error);
            alert('Erro ao carregar os produtos. Tente novamente.');
        });
    }
  

    window.excluirProduto = function(id) {

        fetch(`http://127.0.0.1:5000/produtos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                listarProdutos();
            }
        })
        .catch(error => {
            console.error('Erro ao excluir produto:', error);
            alert('Erro ao excluir o produto. Tente novamente.');
        });
    };
  
    window.editarProduto = function(id) {
        const nome = prompt("Digite o novo nome do produto:");
        const preco = parseFloat(prompt("Digite o novo preço do produto:"));
        if (nome && !isNaN(preco)) {
            fetch(`http://127.0.0.1:5000/produtos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, preco })
            })
            .then(response => {
                if (response.ok) {
                    listarProdutos();
                }
            })
            .catch(error => {
                console.error('Erro ao editar produto:', error);
                alert('Erro ao editar o produto. Tente novamente.');
            });
        }
    };
  
    listarProdutos();
  });
  