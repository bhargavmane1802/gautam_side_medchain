import axios from 'axios';

const uploadToPinata = async (buffer, fileName) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  // 1. Paste your full JWT here (it's a very long string)
  const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmODE2Mjc2Ny1kODBjLTQzNWEtYTEwOC01MjM4NDZmZDEwOWYiLCJlbWFpbCI6ImJoYXJnYXZtYW5lMThAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjEzNDZjYWY0MmU3ZDFmMDNjZjY1Iiwic2NvcGVkS2V5U2VjcmV0IjoiMjIxZGU4YzA1MzA1NTQzMjEyZmYwZTVhODIyNDRlZjVlNDVkYjU0NzJmMGFjNzFkN2E5NzMxOTUyMzQwZjY2OCIsImV4cCI6MTc5Nzg3NzQ3M30.mqHIBtJ5bJXNnhU9_BOPVTAf_X5figRAQmnxUXg0hDc';

  // 2. Prepare the file data
  let data = new FormData();
  data.append('file', new Blob([buffer]), fileName);

  const metadata = JSON.stringify({
    name: fileName,
  });
  data.append('pinataMetadata', metadata);

  try {
    const res = await axios.post(url, data, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data`,
        // Modern Authorization header
        'Authorization': `Bearer ${JWT}` 
      },
    });
    
    // Returns the CID (IpfsHash)
    return res.data.IpfsHash; 
  } catch (error) {
    console.error("Pinata Error Detail:", error.response?.data || error.message);
    throw error;
  }
};

export default uploadToPinata;



