function StatusBadge ({ status }: { status: string }) {
    let color = ''
    let text = ''
    switch (status) {
      case "open":
        color = "green";
        text = "Open";
        break;
      case "in-progress":
        color = "purple";
        text = "In progress";
        break;
      case "in-review":
        color = "orange";
        text = "In review";
        break;
      case "closed":
        color = "red";
        text = "Closed";
        break;
      case "pending":
        color = "purple";
        text = "Pending";
        break;
      case "resolved":
        color = "green";
        text = "Resolved";
        break;
      default:
        color = "gray";
        text = "Unknown";
    }
  
    return (
      <span
        className={`bg-${color}-100 text-${color}-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-md border border-${color}-100 dark:bg-gray-700 dark:border-${color}-500 dark:text-${color}-400`}
      >
        {text}
      </span>
    )
  }

  export default StatusBadge;