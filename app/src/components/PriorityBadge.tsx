
function ProrityBadge ({ priority }: { priority: string }) {
    let text = ''
    switch (priority) {
      case 'medium':
        text = '!'
        break
      case 'high':
        text = '!!'
        break
      default:
        text = ''
    }
  
    return text ? (
      <span className='text-red-500 text-base font-bold pr-1'>{text}</span>
    ) : (
      <></>
    )
  }

  export default ProrityBadge;