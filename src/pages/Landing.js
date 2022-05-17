import styled from 'styled-components';
import Header from '../components/landing/Header';
import LandingFirst from '../components/landing/LandingFirst';
import LandingSecond from '../components/landing/LandingSecond';
import LandingThird from '../components/landing/LandingThird';
import MobileModal from '../components/landing/MobileModal';

const Landing = () => {
  return (
    <>
      <MobileModal />
      <Wrapper>
        <Header />
        <LandingFirst />
        <LandingSecond />
        <LandingThird />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: 1440px;
  border-right: 3px solid red;
`;

export default Landing;
