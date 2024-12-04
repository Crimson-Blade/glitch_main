const handleEndSession = ({ uuid, discount }: { uuid: string, discount: number }) => {
  // Finalize the bill
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/billing/${uuid}/finalize/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ discount_percentage: discount }), // Include discount if applicable
  })
    .then(finalizeResponse => {
      if (finalizeResponse.ok) {
        return finalizeResponse.json();
      } else {
        throw new Error('Failed to finalize bill');
      }
    })
    .then(finalizeData => {
      console.log('Bill finalized:', finalizeData);

      // End the session
      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/${uuid}/end/`, {
        method: 'POST',
      });
    })
    .then(endSessionResponse => {
      if (endSessionResponse.ok) {
        return endSessionResponse.json();
      } else {
        throw new Error('Failed to end session');
      }
    })
    .then(endSessionData => {
      console.log('Session ended:', endSessionData);
      // Optionally, navigate back to the dashboard or disable further actions
    })
    .catch(error => {
      console.error('Error ending session:', error);
    });
};