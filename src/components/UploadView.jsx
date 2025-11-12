import { useState, useRef } from 'react';
import SearchableSelect from './SearchableSelect';

const UploadView = ({ onNavigateToBrowse, onLogout }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [isGeneratingAnswers, setIsGeneratingAnswers] = useState(false);
  const [answers, setAnswers] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      stopCamera();
      
      // Start OCR processing
      processOCR(imageData);
    }
  };

  const processOCR = async (imageData) => {
    setIsProcessingOCR(true);
    
    // Simulate OCR processing (will be replaced with Tesseract.js)
    setTimeout(() => {
      const mockExtractedText = "What is the difference between a compiler and an interpreter in programming languages?";
      setExtractedText(mockExtractedText);
      setIsProcessingOCR(false);
    }, 2000);
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setExtractedText('');
    setAnswers(null);
    setSelectedDepartment('');
    startCamera();
  };

  const generateAnswers = async () => {
    if (!extractedText.trim()) {
      alert('Please capture a question first or enter text manually.');
      return;
    }

    setIsGeneratingAnswers(true);

    // Simulate AI answer generation (will be replaced with Gemini API)
    setTimeout(() => {
      const mockAnswers = {
        briefAnswer: 'A compiler translates entire source code to machine code before execution, while an interpreter translates and executes code line by line.',
        detailedAnswer: 'A compiler is a program that translates the entire source code of a programming language into machine code (binary) before the program runs. This creates an executable file that can run independently. Examples include C, C++, and Rust compilers. Advantages include faster execution and early error detection.\n\nAn interpreter, on the other hand, translates and executes source code line by line or statement by statement during runtime. It does not create a separate executable file. Examples include Python, JavaScript, and Ruby. Advantages include easier debugging and platform independence.\n\nKey Differences:\n1. Execution Speed: Compiled programs run faster\n2. Memory Usage: Interpreters use more memory during execution\n3. Error Detection: Compilers catch all errors before execution\n4. Portability: Interpreted code is more portable across platforms\n5. Development: Interpreters allow for faster development and testing'
      };
      
      setAnswers(mockAnswers);
      setIsGeneratingAnswers(false);
    }, 3000);
  };

  const handleSaveAndPublish = async () => {
    if (!selectedDepartment) {
      alert('Please select a department before publishing.');
      return;
    }

    if (!extractedText || !answers) {
      alert('Please generate answers before publishing.');
      return;
    }

    setIsSaving(true);

    // Simulate saving to database (will be replaced with Appwrite)
    setTimeout(() => {
      setIsSaving(false);
      alert('Question published successfully!');
      
      // Reset form and navigate back to browse
      setCapturedImage(null);
      setExtractedText('');
      setAnswers(null);
      setSelectedDepartment('');
      onNavigateToBrowse();
    }, 2000);
  };

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
                <button 
                  onClick={onNavigateToBrowse}
                  className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50"
                >
                  Browse
                </button>
                <button className="px-4 py-2 rounded-lg font-medium text-indigo-600 bg-indigo-50">
                  Upload
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Upload Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload New Question</h2>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Camera Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full mr-3 text-sm">1</span>
              Capture Question
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                {!cameraActive && !capturedImage && (
                  <button 
                    onClick={startCamera}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Start Camera
                  </button>
                )}
                
                {cameraActive && (
                  <button 
                    onClick={takePicture}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Take Picture
                  </button>
                )}

                {capturedImage && (
                  <button 
                    onClick={retakePicture}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retake
                  </button>
                )}
              </div>

              {/* Camera Preview */}
              {cameraActive && (
                <div className="relative">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    className="w-full max-w-2xl rounded-lg border-4 border-indigo-300"
                  />
                </div>
              )}

              {/* Captured Image */}
              {capturedImage && (
                <div className="relative">
                  <img 
                    src={capturedImage} 
                    alt="Captured question" 
                    className="w-full max-w-2xl rounded-lg border-4 border-green-300"
                  />
                </div>
              )}

              {/* Hidden canvas for image capture */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          {/* Step 2: Extracted Text Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full mr-3 text-sm">2</span>
              Review Extracted Text
            </h3>
            
            <textarea 
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows="6" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Extracted text will appear here... You can edit it if needed."
            />
            
            {isProcessingOCR && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-3"></div>
                  <span className="text-blue-800">Processing image with OCR...</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Generate Answers Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full mr-3 text-sm">3</span>
              Generate Answers
            </h3>
            
            <button 
              onClick={generateAnswers}
              disabled={!extractedText || isGeneratingAnswers}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {isGeneratingAnswers ? 'Generating...' : 'Get Answers with AI'}
            </button>

            {isGeneratingAnswers && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-3"></div>
                  <span className="text-purple-800">Generating answers with Gemini AI...</span>
                </div>
              </div>
            )}

            {/* Answers Display */}
            {answers && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brief Answer</label>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-gray-700">
                    {answers.briefAnswer}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Answer</label>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg max-h-96 overflow-y-auto text-gray-700 whitespace-pre-line">
                    {answers.detailedAnswer}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Save Section */}
          {answers && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full mr-3 text-sm">4</span>
                Save to Hub
              </h3>
              
              <div className="mb-4">
                <label htmlFor="questionDepartment" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Department
                </label>
                <select 
                  id="questionDepartment" 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Choose a department...</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button 
                onClick={handleSaveAndPublish}
                disabled={isSaving || !selectedDepartment}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isSaving ? 'Publishing...' : 'Save and Publish'}
              </button>

              {isSaving && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-3"></div>
                    <span className="text-green-800">Saving to database...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadView;
