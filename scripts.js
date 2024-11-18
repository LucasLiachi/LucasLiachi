// Inicializa o Mermaid
mermaid.initialize({ startOnLoad: false });

// Lista de arquivos Markdown para indexação
const markdownFiles = [
  'content/sobre.md',
  'content/areas.md',
  'content/contato.md'
];

// Cache para armazenar o conteúdo carregado
const cache = new Map();

// Função para carregar um arquivo Markdown
function loadMarkdown(file) {
    if (cache.has(file)) {
        document.getElementById('content').innerHTML = cache.get(file);
        return;
    }

    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error('Arquivo não encontrado');
            }
            return response.text();
        })
        .then(text => {
            const html = marked.parse(text);
            document.getElementById('content').innerHTML = html;
            cache.set(file, html); // Armazena no cache
            mermaid.init(undefined, document.querySelectorAll('.language-mermaid'));
            highlightCodeBlocks();
            addContentLinkListeners();
        })
        .catch(error => {
            document.getElementById('content').innerHTML = '<p>Conteúdo não encontrado.</p>';
            console.error('Erro ao carregar o arquivo Markdown:', error);
        });
}

// Adiciona ouvintes aos links internos no conteúdo
function addContentLinkListeners() {
    const links = document.querySelectorAll('#content a[href$=".md"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const file = 'content/' + link.getAttribute('href');
            loadMarkdown(file);
            history.pushState(null, '', '#' + file);
        });
    });
}

// Adiciona ouvintes aos links no menu lateral
function addSidebarLinkListeners() {
    const links = document.querySelectorAll('#sidebar a[href$=".md"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const file = link.getAttribute('href');
            loadMarkdown(file);
            history.pushState(null, '', '#' + file);
        });
    });
}

// Carrega o arquivo Markdown baseado no hash da URL
function loadContentFromHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        loadMarkdown(hash);
    } else {
        loadMarkdown('content/sobre.md'); // Carrega um arquivo padrão se não houver hash
    }
}

// Função para destacar blocos de código
function highlightCodeBlocks() {
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
}

// Exibe/oculta o menu lateral em dispositivos móveis
document.getElementById('menu-toggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
    const isActive = sidebar.classList.contains('active');
    this.setAttribute('aria-expanded', isActive);
    
    if (isActive) {
        sidebar.focus(); // Define o foco na sidebar para acessibilidade
    }
});

// Adiciona os ouvintes ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadContentFromHash();
    addSidebarLinkListeners();
    window.addEventListener('hashchange', loadContentFromHash); // Atualiza o conteúdo ao mudar o hash na URL
});
