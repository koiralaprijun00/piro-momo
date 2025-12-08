// src/components/ChecklistCategory.tsx
import { ChecklistItem } from '@/app/data/checklist-data';
import { IoCheckmark } from 'react-icons/io5';

interface ChecklistCategoryProps {
  category: {
    name: string;
    icon: string;
    description: string;
  };
  items: ChecklistItem[];
  userProgress: { [key: string]: boolean };
  onToggleItem: (id: string) => void;
}

export default function ChecklistCategory({ category, items, userProgress, onToggleItem }: ChecklistCategoryProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{category.icon}</span>
        <h2 className="text-2xl font-bold">{category.name}</h2>
      </div>
      <p className="text-gray-600 mb-6">{category.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div 
            key={item.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              userProgress[item.id] 
                ? 'bg-green-50 border-green-500' 
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start">
              <div 
                className="w-6 h-6 rounded-full mr-3 flex-shrink-0 cursor-pointer"
                onClick={() => onToggleItem(item.id)}
              >
                {userProgress[item.id] ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                   <IoCheckmark className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                
                {/* Learn more link removed */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}