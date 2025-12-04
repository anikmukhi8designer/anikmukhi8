import { GitHubConfig, SiteContent } from '../types';
import { DEFAULT_CONTENT } from '../constants';

export const getStoredConfig = (): GitHubConfig | null => {
  const stored = localStorage.getItem('portfolio_github_config');
  return stored ? JSON.parse(stored) : null;
};

export const saveConfig = (config: GitHubConfig) => {
  localStorage.setItem('portfolio_github_config', JSON.stringify(config));
};

export const fetchContentFromGitHub = async (config: GitHubConfig): Promise<SiteContent> => {
  // Add timestamp to prevent caching
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch}&t=${Date.now()}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${config.token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch content from GitHub');
  }

  const data = await response.json();
  // GitHub API returns content in base64
  const decodedContent = atob(data.content);
  return JSON.parse(decodedContent);
};

export const saveContentToGitHub = async (config: GitHubConfig, content: SiteContent): Promise<void> => {
  // 1. Get current SHA of the file (required for updates)
  const getUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch}`;
  const getResponse = await fetch(getUrl, {
    headers: {
      'Authorization': `token ${config.token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  let sha: string | undefined;
  if (getResponse.ok) {
    const fileData = await getResponse.json();
    sha = fileData.sha;
  }

  // 2. Prepare PUT request
  const putUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
  const encodedContent = btoa(JSON.stringify(content, null, 2)); // Pretty print JSON

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