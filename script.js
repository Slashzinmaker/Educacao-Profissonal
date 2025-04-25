class CourseProcessor {
  constructor() {
    this.initUI();
    this.startProcessing();
  }

  initUI() {
    this.loader = document.createElement('div');
    Object.assign(this.loader.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '320px',
      padding: '16px',
      background: 'rgba(30, 30, 30, 0.95)',
      borderRadius: '12px',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      zIndex: 9999,
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    });

    const header = document.createElement('div');
    Object.assign(header.style, {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      gap: '10px'
    });

    this.spinner = document.createElement('div');
    this.spinner.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2V6" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 18V22" stroke-width="2" stroke-linecap="round"/>
        <path d="M4.93 4.93L7.76 7.76" stroke-width="2" stroke-linecap="round"/>
        <path d="M16.24 16.24L19.07 19.07" stroke-width="2" stroke-linecap="round"/>
        <path d="M2 12H6" stroke-width="2" stroke-linecap="round"/>
        <path d="M18 12H22" stroke-width="2" stroke-linecap="round"/>
        <path d="M4.93 19.07L7.76 16.24" stroke-width="2" stroke-linecap="round"/>
        <path d="M16.24 7.76L19.07 4.93" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    this.spinner.style.animation = 'spin 1.5s linear infinite';

    const title = document.createElement('span');
    title.textContent = 'Processando Conteúdo';
    title.style.fontSize = '16px';
    title.style.fontWeight = '600';
    title.style.color = '#4CAF50';

    header.appendChild(this.spinner);
    header.appendChild(title);
    this.loader.appendChild(header);

    this.progressContainer = document.createElement('div');
    Object.assign(this.progressContainer.style, {
      height: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      marginBottom: '12px',
      overflow: 'hidden'
    });

    this.progressBar = document.createElement('div');
    Object.assign(this.progressBar.style, {
      height: '100%',
      width: '0%',
      background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
      transition: 'width 0.4s ease',
      borderRadius: '4px'
    });

    this.progressContainer.appendChild(this.progressBar);
    this.loader.appendChild(this.progressContainer);

    this.statusText = document.createElement('div');
    Object.assign(this.statusText.style, {
      fontSize: '14px',
      textAlign: 'center',
      marginBottom: '8px'
    });

    this.detailsText = document.createElement('div');
    Object.assign(this.detailsText.style, {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center'
    });

    this.loader.appendChild(this.statusText);
    this.loader.appendChild(this.detailsText);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(this.loader);
  }

  async startProcessing() {
    try {
      const container = document.getElementById('universe-drawers-courseindex');
      if (!container) throw new Error('Container de cursos não encontrado');

      const links = container.querySelectorAll('a[href]');
      if (!links.length) throw new Error('Nenhum link encontrado');

      const urls = Array.from(links).map(a => a.href);
      await this.processInBatches(urls, 5);
      this.completeProcessing();
    } catch (error) {
      this.showError(error.message);
    }
  }

  async processInBatches(urls, batchSize = 5) {
    const total = urls.length;
    let processed = 0;
    
    for (let i = 0; i < total; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      await this.processBatch(batch);
      
      processed += batch.length;
      this.updateProgress(processed, total);
      this.updateDetails(`Lote ${Math.ceil(i/batchSize)+1} de ${Math.ceil(total/batchSize)}`);
      
      await new Promise(r => setTimeout(r, 350));
    }
  }

  async processBatch(urls) {
    const requests = urls.map(url => 
      fetch(url, {
        method: 'HEAD',
        credentials: 'include',
        cache: 'no-cache'
      }).catch(() => null)
    );
    
    await Promise.all(requests);
  }

  updateProgress(current, total) {
    const percent = Math.round((current / total) * 100);
    this.progressBar.style.width = `${percent}%`;
    this.statusText.textContent = `${percent}% concluído • ${current}/${total} itens`;
  }

  updateDetails(text) {
    this.detailsText.textContent = text;
  }

  completeProcessing() {
    this.progressBar.style.background = 'linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%)';
    this.statusText.textContent = 'Processamento finalizado!';
    this.detailsText.textContent = 'Recarregando a página...';
    this.spinner.style.animation = 'none';
    
    setTimeout(() => {
      this.loader.style.transform = 'translateY(120%)';
      this.loader.style.opacity = '0';
      setTimeout(() => window.location.reload(), 600);
    }, 1800);
  }

  showError(message) {
    this.progressBar.style.background = '#F44336';
    this.statusText.textContent = 'Erro no processamento';
    this.detailsText.textContent = message;
    this.spinner.style.animation = 'none';
    this.spinner.innerHTML = '❌';
    
    setTimeout(() => {
      this.loader.style.background = 'rgba(30, 30, 30, 0.95)';
    }, 4000);
  }
}

new CourseProcessor();
