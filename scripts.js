// Inicializa o Mermaid
mermaid.initialize({ startOnLoad: false });

// Lista de arquivos Markdown para indexação
const markdownFiles = [
    'content/sobre.md',
    'content/areas.md'
];

// Índice de busca
let searchIndex = [];

// Função para construir o índice de busca
function buildSearchIndex() {
    const promises = markdownFiles.map(file => {
        return fetch(file)
            .then(response => response.text())
            .then(text => {
                searchIndex.push({
                    file: file,
                    content: text.toLowerCase(),
                    title: extractTitle(text),
                    rawContent: text
                });
            });
    });

    return Promise.all(promises);
}

// Extrai o título do conteúdo Markdown
function extractTitle(markdownContent) {
    const titleMatch = markdownContent.match(/^#\s+(.*)$/m);
    return titleMatch ? titleMatch[1] : 'Sem Título';
}

// Função para carregar um arquivo Markdown
function loadMarkdown(file) {
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error('Arquivo não encontrado');
            }
            return response.text();
        })
        .then(text => {
            const html = marked.parse(text);
            document.getElementById('content').innerHTML = generateBreadcrumbs(file) + html;
            mermaid.init(undefined, document.querySelectorAll('.language-mermaid'));
            highlightCodeBlocks();
            addContentLinkListeners();
            // Limpa a busca quando um novo conteúdo é carregado
            document.getElementById('search').value = '';
        })
        .catch(error => {
            document.getElementById('content').innerHTML = '<p>Conteúdo não encontrado.</p>';
            console.error('Erro ao carregar o arquivo Markdown:', error);
        });
}

// Adiciona ouvintes aos links internos no conteúdo
function addContentLinkListeners() {
    const links = document.querySelectorAll('#content a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.md')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const file = 'content/' + href;
                loadMarkdown(file);
                history.pushState(null, '', '#' + file);
            });
        }
    });
}

// Adiciona ouvintes aos links no menu lateral
function addSidebarLinkListeners() {
    const links = document.querySelectorAll('#sidebar a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.md')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const file = 'content/' + href;
                loadMarkdown(file);
                history.pushState(null, '', '#' + file);
            });
        }
    });
}

// Carrega o arquivo Markdown baseado no hash da URL
function loadContentFromHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        loadMarkdown(hash);
    } else {
        loadMarkdown('content/sobre.md');
    }
}

// Função para destacar blocos de código
function highlightCodeBlocks() {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

// Função para gerar breadcrumbs
function generateBreadcrumbs(file) {
    const parts = file.replace('content/', '').replace('.md', '').split('/');
    let breadcrumbs = '<nav class="breadcrumbs">';
    let path = '';
    parts.forEach((part, index) => {
        if (index > 0) {
            path += '/';
        }
        path += part;
        if (index < parts.length - 1) {
            breadcrumbs += `<a href="content/${path}.md">${part}</a> / `;
        } else {
            breadcrumbs += `<span>${part}</span>`;
        }
    });
    breadcrumbs += '</nav>';
    return breadcrumbs;
}

// Exibe os resultados da busca
function displaySearchResults(results) {
    const contentDiv = document.getElementById('content');
    if (results.length > 0) {
        let html = '<h2>Resultados da Pesquisa</h2><ul>';
        results.forEach(result => {
            html += `<li><a href="${result.file}">${result.title}</a></li>`;
        });
        html += '</ul>';
        contentDiv.innerHTML = html;
        addContentLinkListeners();
    } else {
        contentDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    }
}

// Implementação da busca
function implementSearch() {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();

        if (query.length > 2) {
            const results = searchIndex.filter(item => item.content.includes(query));
            displaySearchResults(results);
        } else if (query.length === 0) {
            loadContentFromHash();
        }
    });
}

// Inicialização da aplicação
window.addEventListener('load', () => {
    buildSearchIndex().then(() => {
        addSidebarLinkListeners();
        implementSearch();
        loadContentFromHash();
    });
});

window.addEventListener('popstate', loadContentFromHash);
