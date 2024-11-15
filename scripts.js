// Inicializa o Mermaid de forma segura
mermaid.initialize({ startOnLoad: false });

// Lista de arquivos Markdown para indexação
const markdownFiles = ['sobre.md', 'areas.md', 'contato.md'];

// Índice de busca
let searchIndex = [];

// Função para construir o índice de busca com controle de erros
function buildSearchIndex() {
    const promises = markdownFiles.map(file => {
        return fetch(`content/${file}`)
            .then(response => {
                if (!response.ok) throw new Error(`Erro ao carregar ${file}`);
                return response.text();
            })
            .then(text => {
                searchIndex.push({
                    file,
                    content: text.toLowerCase(),
                    title: extractTitle(text),
                    rawContent: text
                });
            })
            .catch(error => console.error('Erro na indexação:', error));
    });

    return Promise.all(promises);
}

// Função para extrair o título com fallback seguro
function extractTitle(markdownContent) {
    const titleMatch = markdownContent.match(/^#\s+(.*)$/m);
    return titleMatch ? titleMatch[1] : 'Sem Título';
}

// Função para carregar um arquivo Markdown com validação
function loadMarkdown(file) {
    fetch(`content/${file}`)
        .then(response => {
            if (!response.ok) throw new Error(`Erro: ${file} não encontrado`);
            return response.text();
        })
        .then(text => {
            const html = marked.parse(text);
            document.getElementById('content').innerHTML = generateBreadcrumbs(file) + html;
            mermaid.init(undefined, document.querySelectorAll('.language-mermaid'));
            highlightCodeBlocks();
            addContentLinkListeners();
            document.getElementById('search').value = '';
        })
        .catch(error => {
            document.getElementById('content').innerHTML = '<p>Conteúdo não encontrado.</p>';
            console.error('Erro ao carregar o arquivo Markdown:', error);
        });
}

// Sanitiza e verifica o hash da URL antes de carregar o conteúdo
function loadContentFromHash() {
    const hash = window.location.hash.substring(1).replace(/[^a-zA-Z0-9-_.\/]/g, '');
    loadMarkdown(hash || 'sobre.md');
}

// Função para destacar blocos de código
function highlightCodeBlocks() {
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
}

// Ouvintes para links internos e links do menu
function addContentLinkListeners() {
    document.querySelectorAll('#content a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.md')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                loadMarkdown(href);
                history.pushState(null, '', `#${href}`);
            });
        }
    });
}

// Ouvintes do menu lateral
function addSidebarLinkListeners() {
    document.querySelectorAll('#sidebar a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.md')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                loadMarkdown(href);
                history.pushState(null, '', `#${href}`);
            });
        }
    });
}

// Função de busca otimizada
function implementSearch() {
    document.getElementById('search').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length > 2) {
            const results = searchIndex.filter(item => item.content.includes(query));
            displaySearchResults(results);
        } else if (query.length === 0) {
            loadContentFromHash();
        }
    });
}

// Inicialização com melhor controle de erros
window.addEventListener('load', () => {
    buildSearchIndex()
        .then(() => {
            addSidebarLinkListeners();
            implementSearch();
            loadContentFromHash();
        })
        .catch(error => console.error('Erro ao inicializar a aplicação:', error));
});

window.addEventListener('popstate', loadContentFromHash);
