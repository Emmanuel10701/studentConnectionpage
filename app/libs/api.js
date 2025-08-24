// lib/api.js

// Fetch all companies
export const fetchCompanies = async () => {
  try {
    const response = await fetch('/api/company');
    if (!response.ok) throw new Error('Failed to fetch companies');
    return await response.json();
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

// Fetch all student profiles
export const fetchStudentProfiles = async () => {
  try {
    const response = await fetch('/api/studententireprofile');
    if (!response.ok) throw new Error('Failed to fetch student profiles');
    return await response.json();
  } catch (error) {
    console.error('Error fetching student profiles:', error);
    return [];
  }
};

// Fetch all employers
export const fetchEmployers = async () => {
  try {
    const response = await fetch('/api/employerRegister');
    if (!response.ok) throw new Error('Failed to fetch employers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching employers:', error);
    return [];
  }
};

// Fetch all subscribers
export const fetchSubscribers = async () => {
  try {
    const response = await fetch('/api/subscribers');
    if (!response.ok) throw new Error('Failed to fetch subscribers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
};