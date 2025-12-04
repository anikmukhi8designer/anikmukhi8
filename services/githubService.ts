import { GitHubConfig, SiteContent } from '../types';

export const getStoredConfig = (): GitHubConfig | null => {
  const stored = localStorage.getItem('portfolio_github_config');
  return stored ? JSON.parse(stored) : null;
};

export const saveConfig = (config: GitHubConfig) => {
  localStorage.setItem('portfolio_github_config', JSON.stringify(config));
};

export const fetchContentFromGitHub = async (config: GitHubConfig): Promise<SiteContent> => {
  // We use the Contents API instead of raw.githubusercontent.com because the API 
  // allows us to bypass edge caching more reliably with headers, ensuring instant updates.
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch}&t=${Date.now()}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${config.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Cache-Control': 'no-cache'
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('File not found. Please check your path and branch settings.');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized. Please check your Personal Access Token.');
    }
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }

  const data = await response.json();
  
  // GitHub API returns content in base64. 
  // We need to decode it properly, handling potential UTF-8 characters.
  try {
    const decodedContent = decodeURIComponent(escape(atob(data.content)));
    return JSON.parse(decodedContent);
  } catch (e) {
    console.error("Failed to parse content", e);
    throw new Error("Failed to parse JSON content from GitHub");
  }
};

export const saveContentToGitHub = async (config: GitHubConfig, content: SiteContent): Promise<void> => {
  // 1. Get current SHA of the file (required for updates to prevent conflicts)
  const getUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch}`;
  const getResponse = await fetch(getUrl, {
    headers: {
      'Authorization': `token ${config.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Cache-Control': 'no-cache'
    }
  });

  let sha: string | undefined;
  if (getResponse.ok) {
    const fileData = await getResponse.json();
    sha = fileData.sha;
  }

  // 2. Prepare PUT request
  const putUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
  
  // Encode content to base64 with UTF-8 support
  const jsonString = JSON.stringify(content, null, 2);
  const encodedContent = btoa(unescape(encodeURIComponent(jsonString)));

  const body = {
    message: `Update portfolio content - ${new Date().toISOString()}`,
    content: encodedContent,
    branch: config.branch,
    sha: sha // Include SHA if file exists
  };

  const putResponse = await fetch(putUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${config.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!putResponse.ok) {
    const error = await putResponse.json();
    throw new Error(error.message || 'Failed to save to GitHub');
  }
};