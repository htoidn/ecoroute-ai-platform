import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface UserData {
  id?: number;
  username?: string;
  email?: string;
  createdAt?: string;
  [key: string]: any;
}

interface RecommendationData {
  id?: number;
  aiScore?: number;
  reason?: string;
  createdAt?: string;
  [key: string]: any;
}

/**
 * Export user data to PDF
 */
export async function exportUserDataToPDF(userData: UserData, recommendations: RecommendationData[] = []): Promise<void> {
  try {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('EcoRoute AI - User Data Export', 14, 22);

    // Add export date
    doc.setFontSize(10);
    doc.text(`Export Date: ${new Date().toLocaleString()}`, 14, 32);

    // Add user information section
    doc.setFontSize(14);
    doc.text('User Information', 14, 45);

    const userDataArray = [
      ['Username', userData.username || 'N/A'],
      ['Email', userData.email || 'N/A'],
      ['User ID', userData.id?.toString() || 'N/A'],
      ['Member Since', userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'],
    ];

    autoTable(doc, {
      startY: 50,
      head: [['Property', 'Value']],
      body: userDataArray,
      theme: 'grid',
      headStyles: {
        fillColor: [72, 187, 120],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      margin: { left: 14, right: 14 },
    });

    // Add recommendations section if available
    if (recommendations && recommendations.length > 0) {
      const currentY = (doc as any).lastAutoTable.finalY + 15;

      doc.setFontSize(14);
      doc.text('Your Recommendations', 14, currentY);

      const recDataArray = recommendations.map((rec: RecommendationData) => [
        rec.id?.toString() || 'N/A',
        rec.aiScore?.toFixed(2) || 'N/A',
        rec.reason?.substring(0, 50) + '...' || 'N/A',
        rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'N/A',
      ]);

      autoTable(doc, {
        startY: currentY + 5,
        head: [['ID', 'AI Score', 'Reason', 'Date']],
        body: recDataArray,
        theme: 'grid',
        headStyles: {
          fillColor: [56, 161, 105],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        margin: { left: 14, right: 14 },
      });
    }

    // Add privacy notice
    const finalY = (doc as any).lastAutoTable?.finalY || 100;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      'This document contains your personal data from EcoRoute AI. Please keep it safe and secure.',
      14,
      finalY + 15
    );

    // Save the PDF
    const filename = `EcoRoute_UserData_${new Date().getTime()}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('Error exporting data to PDF:', error);
    throw error;
  }
}

/**
 * Delete user account
 */
export async function deleteUserAccount(userId: number): Promise<void> {
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete account: ${response.statusText}`);
    }

    // Clear local storage
    localStorage.clear();
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
}

/**
 * Fetch user data for export
 */
export async function fetchUserDataForExport(userId: number): Promise<{ user: UserData; recommendations: RecommendationData[] }> {
  try {
    const [userResponse, recsResponse] = await Promise.all([
      fetch(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      }),
      fetch(`http://localhost:8080/api/recommendations?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      }),
    ]);

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();
    const recsData = recsResponse.ok ? await recsResponse.json() : [];

    return {
      user: userData,
      recommendations: Array.isArray(recsData) ? recsData : recsData.data || [],
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

