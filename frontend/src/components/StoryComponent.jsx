import React, { useRef } from 'react';

const StoryComponent = () => {
    const stories = [
        { userName: 'JDS', avatarUrl: 'https://jdsinternationalschool.com/public/images/pageCategory/1684217026.jpg' },
        { userName: 'JDS', avatarUrl: 'https://jdsinternationalschool.com/public/images/pageCategory/1684217026.jpg' },
        { userName: 'JDS', avatarUrl: 'https://jdsinternationalschool.com/public/images/pageCategory/1684217026.jpg' },
        { userName: 'JDS', avatarUrl: 'https://jdsinternationalschool.com/public/images/pageCategory/1684217026.jpg' },
    ];

    const scrollContainerRef = useRef(null);

    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    return (
        <div className="overflow-hidden py-4">
            <div
                ref={scrollContainerRef}
                className="flex space-x-4 min-w-max scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
            >
                {stories.map((story, index) => (
                    <div key={index} className="flex flex-col items-center">
                        {/* Story Avatar with Hover Animation */}
                        <div className="relative w-20 h-20 rounded-full border-4 border-blue-600 transition-transform transform hover:scale-110 hover:rotate-6 hover:border-blue-400">
                            <img
                                src={story.avatarUrl}
                                alt={`${story.userName}'s avatar`}
                                className="w-full h-full rounded-full object-cover transition-all duration-300 ease-in-out"
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-900 font-medium">{story.userName}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryComponent;
