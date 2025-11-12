import { useState, useMemo } from 'react';
import SearchableSelect from './SearchableSelect';
import jsPDF from 'jspdf';

const BrowseView = ({ isAuthenticated, onNavigateToUpload, onSignIn, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  // Mock past question papers data
  const mockPapers = [
    {
      id: '1',
      school: 'University of Lagos',
      department: 'Computer Science',
      level: '300 Level',
      courseCode: 'CSC 301',
      courseTitle: 'Data Structures and Algorithms',
      year: '2023',
      semester: 'First Semester',
      questionCount: 8,
      createdAt: '2024-11-10'
    },
    {
      id: '2',
      school: 'University of Lagos',
      department: 'Computer Science',
      level: '200 Level',
      courseCode: 'CSC 201',
      courseTitle: 'Introduction to Programming',
      year: '2023',
      semester: 'Second Semester',
      questionCount: 12,
      createdAt: '2024-11-09'
    },
    {
      id: '3',
      school: 'University of Ibadan',
      department: 'Mathematics',
      level: '200 Level',
      courseCode: 'MTH 201',
      courseTitle: 'Linear Algebra',
      year: '2023',
      semester: 'First Semester',
      questionCount: 10,
      createdAt: '2024-11-08'
    },
    {
      id: '4',
      school: 'University of Lagos',
      department: 'Physics',
      level: '100 Level',
      courseCode: 'PHY 101',
      courseTitle: 'Mechanics',
      year: '2023',
      semester: 'First Semester',
      questionCount: 15,
      createdAt: '2024-11-07'
    },
    {
      id: '5',
      school: 'Ahmadu Bello University',
      department: 'Chemistry',
      level: '300 Level',
      courseCode: 'CHM 301',
      courseTitle: 'Organic Chemistry',
      year: '2023',
      semester: 'Second Semester',
      questionCount: 9,
      createdAt: '2024-11-06'
    },
    {
      id: '6',
      school: 'University of Lagos',
      department: 'Computer Science',
      level: '400 Level',
      courseCode: 'CSC 401',
      courseTitle: 'Artificial Intelligence',
      year: '2023',
      semester: 'First Semester',
      questionCount: 7,
      createdAt: '2024-11-05'
    },
  ];

  // Mock questions for a selected paper
  const mockQuestionsForPaper = [
    {
      id: '1',
      number: 1,
      question: 'Explain the time complexity of binary search algorithm and provide a detailed analysis.',
      briefAnswer: 'O(log n) - Binary search divides the search space in half with each step.',
      detailedAnswer: 'Binary search has a time complexity of O(log n) because it repeatedly divides the search interval in half. Starting with an array of n elements, after the first comparison, at most n/2 elements remain. After the second, n/4 remain, and so on. The maximum number of comparisons needed is log₂(n). For example, in an array of 1000 elements, binary search needs at most 10 comparisons (2¹⁰ = 1024).',
    },
    {
      id: '2',
      number: 2,
      question: 'What is a linked list and how does it differ from an array?',
      briefAnswer: 'A linked list is a linear data structure where elements are stored in nodes with pointers, unlike arrays which use contiguous memory.',
      detailedAnswer: 'A linked list is a data structure consisting of nodes where each node contains data and a reference (pointer) to the next node. Key differences from arrays:\n\n1) Memory: Arrays use contiguous memory; linked lists use scattered memory with pointers.\n2) Size: Arrays have fixed size; linked lists are dynamic.\n3) Access: Arrays allow O(1) random access; linked lists require O(n) traversal.\n4) Insertion/Deletion: Linked lists have O(1) at known positions; arrays require shifting elements O(n).\n5) Memory overhead: Linked lists require extra memory for pointers.',
    },
    {
      id: '3',
      number: 3,
      question: 'Define and explain the concept of recursion with an example.',
      briefAnswer: 'Recursion is when a function calls itself to solve a problem by breaking it into smaller subproblems.',
      detailedAnswer: 'Recursion is a programming technique where a function calls itself directly or indirectly. It consists of:\n\n1) Base Case: The condition that stops recursion\n2) Recursive Case: The function calling itself with modified parameters\n\nExample - Factorial:\nfactorial(n) = n * factorial(n-1) if n > 0\nfactorial(0) = 1 (base case)\n\nAdvantages: Elegant code for problems like tree traversal, divide-and-conquer algorithms.\nDisadvantages: Can cause stack overflow if not properly designed, may be slower than iteration.',
    },
  ];

  // Smart filtering with search
  const filteredPapers = useMemo(() => {
    return mockPapers.filter(paper => {
      const matchesSearch = searchQuery === '' || 
        paper.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.school.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSchool = selectedSchool === 'all' || paper.school === selectedSchool;
      const matchesDepartment = selectedDepartment === 'all' || paper.department === selectedDepartment;
      const matchesLevel = selectedLevel === 'all' || paper.level === selectedLevel;
      
      return matchesSearch && matchesSchool && matchesDepartment && matchesLevel;
    });
  }, [searchQuery, selectedSchool, selectedDepartment, selectedLevel]);

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
  };

  const handleBackToList = () => {
    setSelectedPaper(null);
  };

  const generatePDF = (includeAnswers) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add text with word wrap
    const addText = (text, fontSize, isBold = false, color = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      if (isBold) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }
      
      const lines = doc.splitTextToSize(text, maxWidth);
      
      lines.forEach((line) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
      
      yPosition += 5; // Add spacing after text
    };

    // Header
    addText('AI Question Hub', 20, true, [67, 56, 202]);
    addText(`${selectedPaper.courseCode}: ${selectedPaper.courseTitle}`, 16, true);
    addText(`${selectedPaper.school}`, 12);
    addText(`${selectedPaper.department} - ${selectedPaper.level}`, 12);
    addText(`${selectedPaper.year} ${selectedPaper.semester}`, 10, false, [100, 100, 100]);
    yPosition += 10;

    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Questions
    mockQuestionsForPaper.forEach((q, index) => {
      // Question number
      addText(`Question ${q.number}`, 14, true, [67, 56, 202]);
      
      // Question text
      addText(q.question, 11);
      
      if (includeAnswers) {
        yPosition += 5;
        
        // Brief Answer
        addText('Brief Answer:', 11, true, [37, 99, 235]);
        addText(q.briefAnswer, 10);
        
        yPosition += 5;
        
        // Detailed Answer
        addText('Detailed Answer:', 11, true, [34, 197, 94]);
        addText(q.detailedAnswer, 10);
      }
      
      // Add spacing between questions
      if (index < mockQuestionsForPaper.length - 1) {
        yPosition += 10;
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      }
    });

    // Footer on last page
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${totalPages} - Generated from AI Question Hub`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    const filename = includeAnswers 
      ? `${selectedPaper.courseCode}_with_answers.pdf`
      : `${selectedPaper.courseCode}_questions_only.pdf`;
    
    doc.save(filename);
    setShowDownloadModal(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSchool('all');
    setSelectedDepartment('all');
    setSelectedLevel('all');
  };

  const activeFiltersCount = [selectedSchool, selectedDepartment, selectedLevel].filter(f => f !== 'all').length;

  // Generate options for searchable selects
  const schoolOptions = [
    { value: 'all', label: 'All Schools' },
    { value: 'University of Lagos', label: 'University of Lagos (UNILAG)' },
    { value: 'University of Ibadan', label: 'University of Ibadan (UI)' },
    { value: 'Ahmadu Bello University', label: 'Ahmadu Bello University (ABU)' },
    { value: 'Obafemi Awolowo University', label: 'Obafemi Awolowo University (OAU)' },
    { value: 'University of Nigeria', label: 'University of Nigeria, Nsukka (UNN)' },
    { value: 'University of Benin', label: 'University of Benin (UNIBEN)' },
    { value: 'Lagos State University', label: 'Lagos State University (LASU)' },
    { value: 'University of Ilorin', label: 'University of Ilorin (UNILORIN)' },
    { value: 'Covenant University', label: 'Covenant University' },
    { value: 'Babcock University', label: 'Babcock University' },
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Software Engineering', label: 'Software Engineering' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Cyber Security', label: 'Cyber Security' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Statistics', label: 'Statistics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Biochemistry', label: 'Biochemistry' },
    { value: 'Microbiology', label: 'Microbiology' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Electrical Engineering', label: 'Electrical Engineering' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
    { value: 'Civil Engineering', label: 'Civil Engineering' },
    { value: 'Chemical Engineering', label: 'Chemical Engineering' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Accounting', label: 'Accounting' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Mass Communication', label: 'Mass Communication' },
    { value: 'Law', label: 'Law' },
    { value: 'Medicine', label: 'Medicine & Surgery' },
    { value: 'Nursing', label: 'Nursing' },
    { value: 'Pharmacy', label: 'Pharmacy' },
  ];

  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: '100 Level', label: '100 Level' },
    { value: '200 Level', label: '200 Level' },
    { value: '300 Level', label: '300 Level' },
    { value: '400 Level', label: '400 Level' },
    { value: '500 Level', label: '500 Level' },
    { value: '600 Level', label: '600 Level' },
  ];

  // Questions View (when a paper is selected)
  if (selectedPaper) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-800">AI Question Hub</span>
              </div>

              <div className="flex items-center space-x-4">
                {isAuthenticated && (
                  <button 
                    onClick={onLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Questions Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handleBackToList}
              className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Papers
            </button>

            {/* Download Button */}
            <button 
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>

          {/* Paper Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                {selectedPaper.school}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                {selectedPaper.department}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {selectedPaper.level}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedPaper.courseCode}: {selectedPaper.courseTitle}
            </h1>
            <p className="text-gray-600">
              {selectedPaper.year} • {selectedPaper.semester} • {mockQuestionsForPaper.length} Questions
            </p>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {mockQuestionsForPaper.map((q) => (
              <div key={q.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start mb-4">
                  <span className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full font-bold mr-4">
                    {q.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {q.question}
                    </h3>
                  </div>
                </div>
                
                <div className="ml-14 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Brief Answer:</h4>
                    <div className="p-4 bg-blue-50 rounded-lg text-gray-700 text-sm">
                      {q.briefAnswer}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-green-800 mb-2">Detailed Answer:</h4>
                    <div className="p-4 bg-green-50 rounded-lg text-gray-700 text-sm whitespace-pre-line">
                      {q.detailedAnswer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Modal */}
        {showDownloadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Download PDF</h3>
                  <p className="text-gray-600 mt-1">Choose your download option</p>
                </div>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Questions Only Option */}
                <button
                  onClick={() => generatePDF(false)}
                  className="w-full p-4 border-2 border-indigo-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4 text-left">
                      <h4 className="font-bold text-gray-800 text-lg">Questions Only</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Download all questions without answers - Perfect for practice tests
                      </p>
                    </div>
                  </div>
                </button>

                {/* Questions and Answers Option */}
                <button
                  onClick={() => generatePDF(true)}
                  className="w-full p-4 border-2 border-green-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4 text-left">
                      <h4 className="font-bold text-gray-800 text-lg">Questions with Answers</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Download complete study material with brief and detailed answers
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowDownloadModal(false)}
                className="w-full mt-6 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Papers List View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-800">AI Question Hub</span>
              </div>
              
              <div className="hidden md:flex space-x-4">
                <button className="px-4 py-2 rounded-lg font-medium text-indigo-600 bg-indigo-50">
                  Browse
                </button>
                {isAuthenticated && (
                  <button 
                    onClick={onNavigateToUpload}
                    className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <button 
                  onClick={onSignIn}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Sign In to Upload
                </button>
              ) : (
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Browse Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Past Question Papers</h2>
          <p className="text-gray-600">
            {isAuthenticated 
              ? 'Search and browse past questions. You can also upload your own!' 
              : 'Search and browse past questions. Sign in to upload your own!'}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by course name, code, department, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
              <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? 'Hide' : 'Show'} Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <SearchableSelect
                options={schoolOptions}
                value={selectedSchool}
                onChange={setSelectedSchool}
                placeholder="All Schools"
                label="School"
              />

              <SearchableSelect
                options={departmentOptions}
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                placeholder="All Departments"
                label="Department"
              />

              <SearchableSelect
                options={levelOptions}
                value={selectedLevel}
                onChange={setSelectedLevel}
                placeholder="All Levels"
                label="Level"
              />
            </div>
          )}

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-4 text-gray-600">
          Showing <span className="font-semibold">{filteredPapers.length}</span> past question paper{filteredPapers.length !== 1 ? 's' : ''}
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No papers found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredPapers.map((paper) => (
              <div 
                key={paper.id}
                onClick={() => handlePaperClick(paper)}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-all cursor-pointer p-6 hover:scale-105 duration-200"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                    {paper.level}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                    {paper.year}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {paper.courseCode}
                </h3>
                <p className="text-gray-700 font-medium mb-3">
                  {paper.courseTitle}
                </p>
                
                <p className="text-sm text-gray-600 mb-2">{paper.school}</p>
                <p className="text-sm text-gray-600 mb-3">{paper.department}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{paper.semester}</span>
                  <span className="font-semibold text-indigo-600">{paper.questionCount} Questions</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseView;
