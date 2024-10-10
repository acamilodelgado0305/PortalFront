function ContainerSubjcts({subjects}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4 md:px-0">
    {subjects.map((subject, index) => (
      <div
        key={index}
        className="flex flex-col items-center p-4 border border-blue-800 rounded-md shadow-lg transition-shadow"
      >
        <div className="text-4xl mb-2">{subject.icon}</div>
        <p className="text-blue-600 font-semibold">{subject.name}</p>
      </div>
    ))}
  </div>
  )
}

export default ContainerSubjcts