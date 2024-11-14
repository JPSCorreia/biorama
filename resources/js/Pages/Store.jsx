import PropTypes from 'prop-types';

const Store = ({ store }) => {

    return (
        <>
            <h1>{store.name}</h1>
            <p>{store.description}</p>
        </>
    );
};

Store.propTypes = {
    store: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
};

export default Store;
