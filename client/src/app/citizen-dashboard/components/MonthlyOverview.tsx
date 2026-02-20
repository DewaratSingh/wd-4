"use client";

export default function MonthlyOverview() {
    const data = [
        { month: "Jan", height: "40%" },
        { month: "Feb", height: "65%" },
        { month: "Mar", height: "50%" },
        { month: "Apr", height: "85%" },
        { month: "May", height: "70%" },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="font-bold text-gray-900 mb-6">Monthly Overview</h3>

            <div className="flex-1 flex items-end justify-between gap-2 min-h-[150px]">
                {data.map((item, index) => (
                    <div key={item.month} className="flex flex-col items-center gap-2 w-full group">
                        <div className="relative w-full bg-gray-50 rounded-t-lg h-40 flex items-end justify-center group-hover:bg-blue-50 transition-colors">
                            <div
                                className="w-8 bg-blue-500 rounded-t-md transition-all duration-500 ease-out group-hover:bg-blue-600 group-hover:w-10 relative"
                                style={{ height: item.height }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.height}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-gray-500 uppercase">{item.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
