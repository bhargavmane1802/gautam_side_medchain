import { useState, useMemo } from 'react';
import useEth from '../../contexts/EthContext/useEth';
import Title from './Title';
import Cta from './Cta';
import Contract from './Contract';
import ContractBtns from './ContractBtns';
import Desc from './Desc';
import NoticeNoArtifact from './NoticeNoArtifact';
import NoticeWrongNetwork from './NoticeWrongNetwork';

const Demo = () => {
  const { state } = useEth();
  const [value, setValue] = useState('?');

  const content = useMemo(() => {
    // If no smart contract artifact is loaded
    if (!state.artifact) return <NoticeNoArtifact />;

    // If contract is not deployed on the current network
    if (!state.contract) return <NoticeWrongNetwork />;

    return (
      <>
        <Cta />
        <div className="contract-container">
          <Contract value={value} />
          <ContractBtns setValue={setValue} />
        </div>
        <Desc />
      </>
    );
  }, [state.artifact, state.contract, value]);

  return (
    <div className="demo">
      <Title />
      {content}
    </div>
  );
};

export default Demo;
