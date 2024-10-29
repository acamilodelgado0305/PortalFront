import { X } from 'lucide-react';

export  const ScheduleModal = ({ availability, onClose }) => {
    const days = {
      Monday: 'Lunes',
      Tuesday: 'Martes',
      Wednesday: 'Miércoles',
      Thursday: 'Jueves',
      Friday: 'Viernes',
      Saturday: 'Sábado',
      Sunday: 'Domingo'
    };

    function convertToLocalTime(startISO, endISO) {
      const startDate = new Date(startISO);
      const endDate = new Date(endISO);
      
      const localStartTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const localEndTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      return `${localStartTime} - ${localEndTime}`;
  }  

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 py-6">
        <div className="bg-white rounded-lg w-full max-w-lg">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Horario disponible</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {Object.entries(availability || {}).map(([day, data]) => {
                if (!data.enabled) return null;
                return (
                  <div key={day} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-3">{days[day]}</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.timeSlots.map((slot, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {convertToLocalTime(slot.start, slot.end)}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };
