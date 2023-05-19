import {
  isSameDay,
  addDays,
  lastDayOfWeek,
  monthNames,
  daysOfWeek,
} from '../../../utils/dateUtils';

const handleStepsQuery = (
  prompt,
  defaultValues,
  formattedDate,
  retrieveData,
) => {
  if (prompt.toLowerCase().includes('today')) {
    retrieveData('Steps', steps => {
      const todaySteps = steps.find(step =>
        isSameDay(new Date(step.date), new Date()),
      );
      const responseMessage = todaySteps
        ? `You have taken ${todaySteps.steps} steps today.`
        : `You have taken 0 steps today.`;
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
        retrieveData('Steps', steps => {
          const lastDaySteps = steps.find(step =>
            isSameDay(new Date(step.date), lastDayOfWeek(day)),
          );
          const responseMessage = lastDaySteps
            ? `You have taken ${lastDaySteps.steps} steps last ${day}.`
            : `You have taken 0 steps last ${day}.`;
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
    retrieveData('Steps', steps => {
      const yesterdaySteps = steps.find(step =>
        isSameDay(new Date(step.date), addDays(new Date(), -1)),
      );
      const responseMessage = yesterdaySteps
        ? `You have taken ${yesterdaySteps.steps} steps yesterday.`
        : `You have taken 0 steps yesterday.`;
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
        calculateAverage('Steps', 'steps', startDate, endDate, average => {
          const responseMessage = `Your average steps from ${startDate.toDateString()} to ${endDate.toDateString()} was ${Math.round(
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
        });
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
    // Retrieve step count for a specific date
    const dateRegex = /on ([a-zA-Z]+) (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})?/i;
    const match = prompt.match(dateRegex);
    if (match) {
      const month = monthNames.indexOf(match[1].toLowerCase());
      const day = parseInt(match[2], 10);
      //year not specified, use current year
      const year = match[3] ? parseInt(match[3], 10) : new Date().getFullYear();
      const selectedDate = new Date(year, month, day);

      retrieveData('Steps', steps => {
        const selectedDateSteps = steps.find(step =>
          isSameDay(new Date(step.date), selectedDate),
        );
        const responseMessage = selectedDateSteps
          ? `You have taken ${
              selectedDateSteps.steps
            } steps on ${selectedDate.toDateString()}.`
          : `No step count data available for ${selectedDate.toDateString()}.`;
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

export default handleStepsQuery;
