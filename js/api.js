// js/api.js - FIXED: var at top level, globally accessible
var API_BASE = 'http://localhost:8080/api';

async function fetchAPI(endpoint) {
    // Safety: if endpoint is null/undefined, return early
    if (!endpoint) {
        console.error('fetchAPI called with empty endpoint');
        return null;
    }
    
    const url = `${API_BASE}${endpoint}`;
    console.log('Fetching:', url); // Debug log
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch failed:', error);
        return null;
    }
}

async function getProjects() {
    return await fetchAPI('/projects');
}

async function getProjectById(id) {
    // Safety: if id is null/undefined, return early
    if (id == null) {
        console.error('getProjectById called with null/undefined id');
        return null;
    }
    return await fetchAPI(`/projects/${id}`);
}

async function getFeaturedProjects() {
    return await fetchAPI('/projects/featured');
}

async function getProjectsByCategory(cat) {
    const map = {
        'architecture': 'ARCHITECTURE',
        'commercial': 'COMMERCIAL',
        'office': 'OFFICE',
        'residential': 'RESIDENTIAL'
    };
    const backendCat = map[cat] || 'ARCHITECTURE';
    return await fetchAPI(`/projects/category/${backendCat}`);
}

async function getTeam() {
    return await fetchAPI('/team');
}

async function getPartners() {
    return await fetchAPI('/team/partners');
}