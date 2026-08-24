import bcrypt from 'bcryptjs';

const users = [
    // Owner 
    {
        name: 'Sunrise Towers Admin',
        email: 'admin@sunrisetowers.com',
        mobile: '9876500000',
        password: bcrypt.hashSync('123456', 10),
        role: 'admin',
        flatNumber: null,
        floorNumber: null,
        photo: '',
        status: 'Active',
    },
    // Security 
    {
        name: 'Rajesh Kumar',
        email: 'rajesh@sunrisetowers.com',
        mobile: '9876500001',
        password: bcrypt.hashSync('123456', 10),
        role: 'security',
        flatNumber: null,
        floorNumber: null,
        photo: '',
        status: 'Active',
    },
    {
        name: 'Suresh Patil',
        email: 'suresh@sunrisetowers.com',
        mobile: '9876500002',
        password: bcrypt.hashSync('123456', 10),
        role: 'security',
        flatNumber: null,
        floorNumber: null,
        photo: '',
        status: 'Active',
    },
    // Resident
    // Flat 1 
    {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@sunrisetowers.com',
        mobile: '9876510101',
        password: bcrypt.hashSync('123456', 10),
        role: 'resident',
        flatNumber: '101',
        floorNumber: 1,
        photo: '',
        status: 'Active',
    },
    // FLAT 102
    {
        name: 'Vikram Mehta',
        email: 'vikram.mehta@sunrisetowers.com',
        mobile: '9876510201',
        password: bcrypt.hashSync('123456', 10),
        role: 'resident',
        flatNumber: '102',
        floorNumber: 1,
        photo: '',
        status: 'Active',
    },
    // FLAT 103
    {
        name: 'Rahul Joshi',
        email: 'rahul.joshi@sunrisetowers.com',
        mobile: '9876510301',
        password: bcrypt.hashSync('123456', 10),
        role: 'resident',
        flatNumber: '103',
        floorNumber: 1,
        photo: '',
        status: 'Active',
    },

    // FLAT 104
    {
        name: 'Arjun Patel',
        email: 'arjun.patel@sunrisetowers.com',
        mobile: '9876510401',
        password: bcrypt.hashSync('123456', 10),
        role: 'resident',
        flatNumber: '104',
        floorNumber: 1,
        photo: '',
        status: 'Active',
    },
    // FLAT 105
    {
        name: 'Sanjay Deshmukh',
        email: 'sanjay.deshmukh@sunrisetowers.com',
        mobile: '9876510501',
        password: bcrypt.hashSync('123456', 10),
        role: 'resident',
        flatNumber: '105',
        floorNumber: 1,
        photo: '',
        status: 'Active',
    },
];

export default users;