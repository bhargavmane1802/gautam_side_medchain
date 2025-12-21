import { create } from 'ipfs-http-client';

// Vite environment variables
const projectId = import.meta.env.VITE_IPFS_PROJECT_ID;
const projectSecret = import.meta.env.VITE_IPFS_PROJECT_SECRET;

// Basic auth for Infura
const auth = 'Basic ' + btoa(`${projectId}:${projectSecret}`);

// Create IPFS client
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export default ipfs;
