import {
  isSameDay,
  addDays,
  lastDayOfWeek,
  monthNames,
  daysOfWeek,
} from '../../../utils/dateUtils';

const handleCaloriesQuery = (
  prompt,
  defaultValues,
  formattedDate,
  retrieveData,
) => {
  if (prompt.toLowerCase().includes('today')) {
    retrieveData('Calories', calories => {
      const todayCalories = calories.find(calorie =>
        isSameDay(new Date(calorie.date), new Date()),
      );
      const responseMessage = todayCalories
        ? `You have burned ${todayCalories.calories} calories today.`
        : `You have burned 0 calories today.`;
      const updatedConversation = [
        {
          speaker: defaultValues.name,
          message: prompt,
          time: formattedDate,
        },
        {
          speaker: defaultValues.aiName,
          message: responseMessage,
          time: formattedDate,
        },
      ];
      return {apiResponse: responseMessage, conversation: updatedConversation};
    });
  } else if (prompt.toLowerCase().includes('last')) {
    for (let day of daysOfWeek) {
      if (prompt.toLowerCase().includes(`last ${day}`)) {
        retrieveData('Calories', calories => {
          const lastDayCalories = calories.find(calorie =>
            isSameDay(new Date(calorie.date), lastDayOfWeek(day)),
          );
          const responseMessage = lastDayCalories
            ? `You have burned ${lastDayCalories.calories} calories last ${day}.`
            : `You have burned 0 calories last ${day}.`;
          const updatedConversation = [
            {
              speaker: defaultValues.name,
              message: prompt,
              time: formattedDate,
            },
            {
              speaker: defaultValues.aiName,
              message: responseMessage,
              time: formattedDate,
            },
          ];
          return {
            apiResponse: responseMessage,
            conversation: updatedConversation,
          };
        });
        break;
      }
    }
  } else if (prompt.toLowerCase().includes('yesterday')) {
    retrieveData('Calories', calories => {
      const yesterdayCalories = calories.find(calorie =>
        isSameDay(new Date(calorie.date), addDays(new Date(), -1)),
      );
      const responseMessage = yesterdayCalories
        ? `You have burned ${yesterdayCalories.calories} calories yesterday.`
        : `You have burned 0 calories yesterday.`;
      const updatedConversation = [
        {
          speaker: defaultValues.name,
          message: prompt,
          time: formattedDate,
        },
        {
          speaker: defaultValues.aiName,
          message: responseMessage,
          time: formattedDate,
        },
      ];
      return {apiResponse: responseMessage, conversation: updatedConversation};
    });
  } else if (prompt.toLowerCase().includes('average')) {
    // Parse date range from user input
    const dateRegex =
      /average from ([a-zA-Z]+\s\d{1,2},\s\d{4}) to ([a-zA-Z]+\s\d{1,2},\s\d{4})/i;
    const match = prompt.match(dateRegex);
    if (match) {
      const startDate = new Date(match[1]);
      const endDate = new Date(match[2]);
      if (startDate && endDate) {
        calculateAverage(
          'Calories',
          'calories',
          startDate,
          endDate,
          average => {
            const responseMessage = `Your average calories burned from ${startDate.toDateString()} to ${endDate.toDateString()} was ${Math.round(
              average,
            )}.`;
            const updatedConversation = [
              {
                speaker: defaultValues.name,
                message: prompt,
                time: formattedDate,
              },
              {
                speaker: defaultValues.aiName,
                message: responseMessage,
                time: formattedDate,
              },
            ];
            return {
              apiResponse: responseMessage,
              conversation: updatedConversation,
            };
          },
        );
      } else {
        const errorMessage =
          'Sorry, I did not understand the date range. Please use the format "Month Day, Year".';
        const updatedConversation = [
          {
            speaker: defaultValues.name,
            message: prompt,
            time: formattedDate,
          },
          {
            speaker: defaultValues.aiName,
            message: errorMessage,
            time: formattedDate,
          },
        ];
        return {apiResponse: errorMessage, conversation: updatedConversation};
      }
    } else {
      const errorMessage = 'Sorry, I did not understand your question.';
      const updatedConversation = [
        {
          speaker: defaultValues.name,
          message: prompt,
          time: formattedDate,
        },
        {
          speaker: defaultValues.aiName,
          message: errorMessage,
          time: formattedDate,
        },
      ];
      return {apiResponse: errorMessage, conversation: updatedConversation};
    }
  } else if (prompt.toLowerCase().includes('on')) {
    // Retrieve calories burned for a specific date
    const dateRegex = /on ([a-zA-Z]+) (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})?/i;
    const match = prompt.match(dateRegex);
    if (match) {
      const month = monthNames.indexOf(match[1].toLowerCase());
      const day = parseInt(match[2], 10);
      const year = match[3] ? parseInt(match[3], 10) : new Date().getFullYear();
      const selectedDate = new Date(year, month, day);
      retrieveData('Calories', calories => {
        const selectedDateCalories = calories.find(calorie =>
          isSameDay(new Date(calorie.date), selectedDate),
        );
        const responseMessage = selectedDateCalories
          ? `You have burned ${
              selectedDateCalories.calories
            } calories on ${selectedDate.toDateString()}.`
          : `No calories data available for ${selectedDate.toDateString()}.`;
        const updatedConversation = [
          {
            speaker: defaultValues.name,
            message: prompt,
            time: formattedDate,
          },
          {
            speaker: defaultValues.aiName,
            message: responseMessage,
            time: formattedDate,
          },
        ];
        return {
          apiResponse: responseMessage,
          conversation: updatedConversation,
        };
      });
    } else {
      const errorMessage = 'Sorry, I did not understand your question.';
      const updatedConversation = [
        {
          speaker: defaultValues.name,
          message: prompt,
          time: formattedDate,
        },
        {
          speaker: defaultValues.aiName,
          message: errorMessage,
          time: formattedDate,
        },
      ];
      return {apiResponse: errorMessage, conversation: updatedConversation};
    }
  } else {
    const errorMessage = 'Sorry, I did not understand your question.';
    const updatedConversation = [
      {
        speaker: defaultValues.name,
        message: prompt,
        time: formattedDate,
      },
      {
        speaker: defaultValues.aiName,
        message: errorMessage,
        time: formattedDate,
      },
    ];
    return {apiResponse: errorMessage, conversation: updatedConversation};
  }
};

export default handleCaloriesQuery;
