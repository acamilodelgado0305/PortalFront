import React, { useState, useEffect } from 'react';

const SearchAndFilter = ({ teachers, setFilterTeachers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    setFilterTeachers(teachers);
  }, [teachers, setFilterTeachers]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredTeachers = teachers.filter((teacher) => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
      const subjectMatch = selectedSubject === '' || teacher.subjectYouTeach == selectedSubject;

      return (term === '' || fullName.includes(term.toLowerCase())) && subjectMatch;
    });

    setFilterTeachers(filteredTeachers);
  };

  const handleSubjectChange = (e) => {
    const subject = e.target.value;

    setSelectedSubject(subject);

    const filteredTeachers = teachers.filter((teacher) => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
      const subjectMatch = subject === '' || teacher.subjectYouTeach == subject;

      return (searchTerm === '' || fullName.includes(searchTerm.toLowerCase())) && subjectMatch;
    });

    setFilterTeachers(filteredTeachers);
  };

  return (
    <div className="pl-0 py-6 ">
      <h1 className="text-2xl font-bold mb-4">Buscar Profesores</h1>

      <div className="flex mb-4 space-x-4">
        <input
          type="text"
          placeholder="Buscar por nombre y apellido"
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 w-60 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">all</option>
          <option value="math">Mathematics</option>
          <option value="science">Science</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter;
