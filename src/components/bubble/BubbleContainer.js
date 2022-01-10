import styled from 'styled-components';
import ReactModal from 'react-modal';

const BubbleContainer = ({ isModalOpen, setIsModalOpen }) => {
  ReactModal.defaultStyles.overlay.backgroundColor = `rgb(0, 0, 0, 0)`;
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      ariaHideApp={false}
    >
      <p>hi</p>
    </Modal>
  );
};

const Modal = styled(ReactModal)`
  position: absolute;
  top: 17vh;
  left: 63.4vw;
  /* position: absolute; */
  width: 336px;
  background: #ffffff;

  // looks
  background-color: #fff;
  padding: 1.125em 1.5em;
  font-size: 1.25em;
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.3),
    0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2);
`;
export default BubbleContainer;
