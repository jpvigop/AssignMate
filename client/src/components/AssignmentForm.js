import React, { useState } from 'react';

const AssignmentForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    writingSample: '',
    classMaterials: '',
    assignmentPrompt: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map classMaterials to materials before submitting
    const formDataForSubmit = {
      writingSample: formData.writingSample,
      assignmentPrompt: formData.assignmentPrompt,
      materials: formData.classMaterials
    };
    onSubmit(formDataForSubmit);
  };

  const isFormValid = () => {
    return formData.writingSample.trim() !== '' && 
           formData.classMaterials.trim() !== '' && 
           formData.assignmentPrompt.trim() !== '';
  };

  return (
    <div className="card">
      <h2>Input Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="writingSample">
            Your Writing Sample
            <span className="text-muted"> (Provide a paragraph you've written)</span>
          </label>
          <p className="form-tip">For best results, include at least 200-300 words of your authentic writing. The more you provide, the better the system can analyze your unique style patterns, including sentence structure, vocabulary preferences, and natural quirks.</p>
          <textarea
            id="writingSample"
            name="writingSample"
            value={formData.writingSample}
            onChange={handleChange}
            placeholder="Paste a sample of your writing here (essays, blog posts, reports you've written)..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="classMaterials">
            Class Materials
            <span className="text-muted"> (Notes, readings, lecture summaries)</span>
          </label>
          <p className="form-tip">For optimal results, include specific content from your course materials such as: key concepts and definitions, important facts or statistics, relevant quotes, detailed examples, and any theories or frameworks. The system will identify and thoughtfully integrate these elements while maintaining your writing style.</p>
          <textarea
            id="classMaterials"
            name="classMaterials"
            value={formData.classMaterials}
            onChange={handleChange}
            placeholder="Paste relevant class materials here (lecture notes, textbook excerpts, research findings)..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="assignmentPrompt">
            Assignment Prompt
            <span className="text-muted"> (What you need to write)</span>
          </label>
          <p className="form-tip">Provide the exact assignment instructions, including any specific requirements about length, format, or focus areas.</p>
          <textarea
            id="assignmentPrompt"
            name="assignmentPrompt"
            value={formData.assignmentPrompt}
            onChange={handleChange}
            placeholder="Enter your assignment prompt here..."
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !isFormValid()}
        >
          {loading ? (
            <>
              Generating
              <span className="loading"></span>
            </>
          ) : (
            'Generate Assignment'
          )}
        </button>
      </form>
    </div>
  );
};

export default AssignmentForm; 