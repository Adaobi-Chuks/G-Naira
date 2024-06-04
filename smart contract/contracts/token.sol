// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract ERC20Token {
    string private tokenName;
    string private tokenSymbol;
    uint256 private tokenDecimals;
    uint256 tokenTotalSupply;

    address immutable i_owner;

    mapping(address account => uint256 amount) balances; // Holds the balances of an account(address) on the contract.
    mapping(address owner => mapping(address spender => uint256 amount)) allowances; // Holds the the `amount` an owner approves a spender on his behalf.
    mapping(address => bool) private _blacklist;

    event Transfer(address from, address to, uint256 amount);
    event Approval(address owner, address spender, uint256 amount);
    event Minted(address to, uint256 amount);
    event Burned(address to, uint256 amount);
    
    event Blacklisted(address indexed account);
    event Whitelisted(address indexed account);

    modifier onlyOwner() {
        require(msg.sender == i_owner, "Not Owner");
        _;
    }

    modifier notBlacklisted(address account) {
        require(!_blacklist[account], "Address is blacklisted");
        _;
    }

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenDecimal
    ) {
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        tokenDecimals = _tokenDecimal;
        i_owner = msg.sender;
    }

    function name() public view returns (string memory) {
        return tokenName;
    }

    function symbol() public view returns (string memory) {
        return tokenSymbol;
    }

    function decimals() public view returns (uint256) {
        return tokenDecimals;
    }

    function totalSupply() public view returns (uint256) {
        return tokenTotalSupply;
    }

    function balanceOf(address account) public view returns (uint256 balance) {
        return balances[account];
    }

    function transfer(
        address to,
        uint256 amount
    ) public notBlacklisted(msg.sender) notBlacklisted(to) returns (bool success) {
        // checks that the reciever's address is not a zero address
        require(to != address(0), "ERC20: transfer to the zero address");
        // checks that the sender (caller of this function) is not a zero address
        require(
            msg.sender != address(0),
            "ERC20: transfer from the zero address"
        );
        // checks that the amount to be sent is greater than zero. don't allow the user to send zero amount.
        require(amount > 0, "Increase amount");
        // checks that the balance of the sender (address `from`) is greater than or equal to amount. Don't allow user to sender morethan they have in their account.
        require(balanceOf(msg.sender) >= amount, "ERC20: Insufficient Fund");
        // subtract the amount from the balances of the sender.Debit the sender
        balances[msg.sender] -= amount;
        // add the `amount` to the balance of the receiver. Credit the receiver
        balances[to] += amount;
        success = true;
        // emit Transfer event.
        emit Transfer(msg.sender, to, amount);
    }

    function approve(
        address spender,
        uint256 amount
    ) public notBlacklisted(msg.sender) notBlacklisted(spender) returns (bool success) {
        // sets the allowances of the `spender` to the `amount` specified by the `owner`(the caller of this function)
        allowances[msg.sender][spender] = amount;
        success = true;
        emit Approval(msg.sender, spender, amount);
    }

    function allowance(
        address owner,
        address spender
    ) public notBlacklisted(owner) notBlacklisted(spender) view returns (uint256) {
        return allowances[owner][spender];
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public notBlacklisted(from) notBlacklisted(to) returns (bool success) {
        require(to != address(0), "ERC20: transfer to the zero address");

        require(from != address(0), "ERC20: transfer from the zero address");

        require(amount > 0, "Increase amount");

        require(balanceOf(from) >= amount, "ERC20: Insufficient Fund");

        // check if amount is less than or equal to allowances
        require(amount <= allowance(from, to), "Insufficient allowance");
        // subtract amount from the allowances mapping.
        allowances[from][to] -= amount;
        // subtract 'amount` from the balances of the `from` address. Debit the sender
        balances[from] -= amount;
        // add `amount` to the balances of the `to` address. Credit the receiver
        balances[to] += amount;

        // return bool success
        success = true;

        emit Transfer(from, to, amount);
    }

    // Hint: The mint and burn token function are not part of the core EIP-20 Token Standard

    function mint(address to, uint256 amount) notBlacklisted(to) external onlyOwner {
        require(
            to != address(0),
            "ERC20: transfer to the zero address not allowed"
        );
        // add `amount` to the totalSupply ie increase the tokenTotalSupply by `amount`.
        tokenTotalSupply += amount;

        // add `amount` to the balances of  `to` (the receiver).
        balances[to] += amount;

        emit Minted(to, amount);
    }

    function burn(address to, uint256 amount) notBlacklisted(to) external onlyOwner {
        require(balanceOf(msg.sender) >= amount, "Insufficient Balance");

        // subtract `amount` to the balances of  `to` (the receiver).
        balances[msg.sender] -= amount;

        // subtract `amount` from the totalSupply ie decrease the tokenTotalSupply by `amount`.
        tokenTotalSupply -= amount;

        emit Burned(to, amount);
    }

    function blacklistAddress(address account) external onlyOwner {
        require(account != address(0), "Cannot blacklist the zero address");
        require(!_blacklist[account], "Address is already blacklisted");

        _blacklist[account] = true;
        emit Blacklisted(account);
    }

    function whitelistAddress(address account) external onlyOwner {
        require(account != address(0), "Cannot whitelist the zero address");
        require(_blacklist[account], "Address is not blacklisted");

        _blacklist[account] = false;
        emit Whitelisted(account);
    }

}