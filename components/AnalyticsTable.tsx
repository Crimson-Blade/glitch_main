import React, { useState, useEffect, useMemo } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Popper, InputAdornment } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { styled } from "@mui/material/styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Calendar icon
import dayjs, { Dayjs } from "dayjs"; // Import Dayjs
import { useDailyBillsData, updateBillVerification } from "@/lib/handlers";
import { MinusCircle, PlusCircle } from "lucide-react";
import { format } from "date-fns";

interface TableEntry {
  user_id: number;
  username: string;
  amount: number;
  date: string;
  bill_verified: boolean;
}

const AnalyticTable: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [allChecked, setAllChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); // Using Dayjs for date

  // Fetch data using useDailyBillsData
  const defaultDate = useMemo(() => selectedDate?.toDate() || new Date(), [selectedDate]);
  const { data, isLoading, error } = useDailyBillsData(defaultDate);

  useEffect(() => {
    setAllChecked(data?.length > 0 && checkedItems.size === data.length);
  }, [checkedItems, data?.length]);

  useEffect(() => {
    
    if (data) {
      const verifiedItems: Set<number> = new Set(data.filter((entry: TableEntry) => entry.bill_verified).map((entry: TableEntry) => entry.user_id));
      setCheckedItems(verifiedItems);
    }
  }, [data]);

  const filteredData = selectedDate
    ? data?.filter((entry: TableEntry) => {
        const entryDate = dayjs(entry.date); // Convert string date to Dayjs
        return entryDate.isSame(selectedDate, "day");
      })
    : data;

  const handleCheckboxChange = async (userId: number) => {
    setCheckedItems((prev) => {
      const updated = new Set(prev);
      if (updated.has(userId)) {
        updated.delete(userId);
      } else {
        updated.add(userId);
      }
      return updated;
    });

    try {
      await updateBillVerification(userId, !checkedItems.has(userId));
    } catch (error) {
      console.error('Failed to update bill verification:', error);
      // Revert the optimistic update in case of an error
      setCheckedItems((prev) => {
        const updated = new Set(prev);
        if (updated.has(userId)) {
          updated.delete(userId);
        } else {
          updated.add(userId);
        }
        return updated;
      });
    }
  };

  const handleIncrementDate = () => {
    setSelectedDate((current) => (current ? current.add(1, "day") : dayjs().add(1, "day")));
  };

  const handleDecrementDate = () => {
    setSelectedDate((current) => (current ? current.subtract(1, "day") : dayjs().subtract(1, "day")));
  };

  // Custom styling for the TextField
  const StyledTextField = styled(TextField)({
    "& .MuiInputBase-root": {
      backgroundColor: "white", // White background for the input field
      color: "#3f0071", // Purple text color inside the input
    },
    "& .MuiInputLabel-root": {
      color: "#3f0071", // Purple label color
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6a1b9a", // Purple border by default
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9c4dcc", // Lighter purple when focused
    },
  });

  // Custom Popper for the dropdown (calendar) styling
  const StyledPopper = styled(Popper)({
    "& .MuiPaper-root": {
      backgroundColor: "#3f0071", // Purple background for the calendar dropdown
      color: "white", // Text color for the calendar
      borderRadius: "10px", // Rounded corners for the dropdown
    },
    "& .MuiPickersDay-root": {
      color: "white", // Day text color
    },
    "& .MuiPickersDay-daySelected": {
      backgroundColor: "#9c4dcc", // Selected day background color
    },
    "& .MuiPickersDay-root:hover": {
      backgroundColor: "#6a1b9a", // Hover effect on day
    },
  });

  // Customizing the DatePicker itself to have white background and purple border by default
  const StyledDatePicker = styled(DatePicker)({
    "& .MuiInputBase-root": {
      backgroundColor: "white", // White background for the input field
      color: "#3f0071",
      fontWeight: "bold",
      padding: "0px 10px",
      borderRadius: "30px", // Purple text color
    },
    "& .MuiOutlinedInput-root": {
      border: "2px solid #9c4dcc", // Purple border when not focused
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "2px solid #9c4dcc", // Lighter purple for the focused state
    },
  });

  return (
    <div className="overflow-x-auto pt-10">
      <div className="text-right mb-10 flex items-center justify-end space-x-2">
        <button
          onClick={handleDecrementDate}
          className="bg-purple-600 text-white px-2 py-2 rounded-full hover:bg-purple-700"
        >
          <MinusCircle className="w-7 h-7" />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StyledDatePicker
            value={selectedDate}
            onChange={(newDate: Dayjs | null) => setSelectedDate(newDate)} // Update to Dayjs type
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label="Select Date"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end" sx={{ paddingRight: "10px" }}>
                      <CalendarTodayIcon style={{ color: "#3f0071" }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            PopperComponent={StyledPopper} // Apply custom Popper style
          />
        </LocalizationProvider>
        <button
          onClick={handleIncrementDate}
          className="bg-purple-600 text-white px-2 py-2 rounded-full hover:bg-purple-700"
        >
          <PlusCircle className="w-7 h-7" />
        </button>
      </div>

      <table className="min-w-full border bg-opacity-40 backdrop-blur-md rounded-md border-purple-600">
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="p-3 border-r border-purple-500 text-center">Username</th>
            <th className="p-3 border-r border-purple-500 text-center">Amount</th>
            <th className="p-3 border-r border-purple-500 text-center">Date</th>
            <th className="p-3 border-r border-purple-500 text-center">Billing</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {isLoading || error ? (
            <tr>
              <td colSpan={4} className="p-3 text-center text-gray-400">
                {isLoading ? (
                  <p className="text-center text-white">Loading...</p>
                ) : (
                  <p className="text-center text-red-500">Error: {error?.message}</p>
                )}
              </td>
            </tr>
          ) : filteredData && filteredData.length > 0 ? (
            filteredData.map((entry: TableEntry) => (
              <tr key={entry.user_id}>
                <td className="p-3 border-r border-b border-purple-300 text-center">
                  {entry.username}
                </td>
                <td className="p-3 border-r border-b border-purple-300 text-center">
                  ${entry.amount?.toFixed(2) || " NA"}
                </td>
                <td className="p-3 border-r border-b border-purple-300 text-center">
                  {format(entry.date, 'yyyy-MM-dd')}
                </td>
                <td className="p-3 border-r border-b border-purple-300 text-center">
                  <label className="relative inline-flex items-center justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedItems.has(entry.user_id)}
                      onChange={() => handleCheckboxChange(entry.user_id)}
                      className="peer hidden"
                    />
                    <span className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-600">
                      <CheckIcon
                        className={`text-white text-xl transition-all duration-200 transform ${
                          checkedItems.has(entry.user_id) ? "opacity-100 scale-100" : "opacity-0 scale-0"
                        }`}
                      />
                    </span>
                  </label>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-3 text-center text-gray-400">
                No entries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pt-4 text-center text-white">
        {allChecked ? (
          <p className="text-green-500 text-2xl font-semibold">Billing completed for today.</p>
        ) : (
          <p className="text-red-500 text-2xl font-semibold">Billing not done yet.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticTable;