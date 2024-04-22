pragma solidity ^0.8.1;

contract FundingCampaign {
    address public admin;

    enum CampaignStage {
        NotStarted,
        Stage1,
        Stage2,
        Completed
    }

    struct Campaign {
        string name;
        string details;
        string thumbnailUrl;
        uint256 campaignExpiry;
        string[] documentsLinks;
        uint256[] amounts; // Dynamic array to store target, stage1, and stage2 amounts
        uint256 totalFunds;
        uint256 paidfunds;
        CampaignStage status;
        string whichStage;
        bool stage1Completed;
        bool stage2Completed;
        address creator;
        bool adminApproved;
        address[] contributors;
        mapping(address => uint256) contributions;
        mapping(address => uint256) stageContributions;
        mapping(address => bool) votedForStage;
        mapping(CampaignStage => uint256) stageVotesFor;
        mapping(CampaignStage => uint256) stageVotesAgainst;
    }

    struct User {
        uint256[] campaignIndices;
    }

    mapping(address => User) private users;

    Campaign[] public campaigns;
    uint256 public platformBalance = 0;
    uint256 constant PLATFORM_FEE_PERCENTAGE = 1;

    event Contribution(
        address indexed contributor,
        uint256 amount,
        uint256 campaignIndex
    );
    event Withdrawal(uint256 amount, address recipient, uint256 campaignIndex);
    event StageCompletion(uint256 stage, uint256 campaignIndex);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyCreator(uint256 _campaignIndex) {
        require(
            msg.sender == campaigns[_campaignIndex].creator,
            "Only creator can call this function"
        );
        _;
    }

    modifier onlyApprovedCampaign(uint256 _campaignIndex) {
        require(
            campaigns[_campaignIndex].adminApproved,
            "Campaign is not approved by admin"
        );
        _;
    }

    function createCampaign(
        string memory _name,
        string memory _details,
        string memory _thumbnailUrl,
        uint256[] memory _amounts, // Modified to use an array for target, stage1, and stage2 amounts
        uint256 _expiryTimestamp, // New parameter for campaign expiry
        string[] memory _documentsLinks // New parameter for document links
    ) external {
        require(msg.sender != address(0), "Creator address cannot be zero");
        require(bytes(_name).length > 0, "Campaign name cannot be empty");
        require(_amounts.length == 3, "Invalid amounts array length");
        require(
            _amounts[0] > 0 && _amounts[1] > 0 && _amounts[2] > 0,
            "Amounts must be greater than 0"
        );
        require(
            _amounts[1] + _amounts[2] == _amounts[0],
            "Stage 2 amount + Stage 1 amount must be equal to target amount"
        );
        Campaign storage newCampaign = campaigns.push();
        newCampaign.name = _name;
        newCampaign.details = _details;
        newCampaign.thumbnailUrl = _thumbnailUrl;
        newCampaign.amounts = _amounts;
        newCampaign.creator = msg.sender;
        newCampaign.adminApproved = false;
        newCampaign.status = CampaignStage.NotStarted;
        newCampaign.whichStage = "";
        newCampaign.campaignExpiry = _expiryTimestamp; // Assigning campaign expiry from user input
        newCampaign.documentsLinks = _documentsLinks; // Assigning document links from user input
    }

    function contribute(uint256 _campaignIndex)
        external
        payable
        onlyApprovedCampaign(_campaignIndex)
    {
        require(_campaignIndex < campaigns.length, "Invalid campaign index");
        require(msg.value > 0, "Contribution amount must be greater than 0");

        Campaign storage campaign = campaigns[_campaignIndex];

        require(
            campaign.status != CampaignStage.Completed,
            "Contribution not allowed in completed campaigns"
        );

        // Check if the campaign is expired
        require(
            block.timestamp < campaign.campaignExpiry,
            "Contribution not allowed, campaign has expired"
        );

        // Check if the campaign is in Stage 1 or Stage 2
        if (
            keccak256(bytes(campaign.whichStage)) == keccak256("stage1") ||
            keccak256(bytes(campaign.whichStage)) == keccak256("stage2")
        ) {
            uint256 stageIndex = getIndex(campaign.whichStage); // 2
            // uint256 stageAmount = campaign.amounts[stageIndex];

            uint256 stageAmount;
            if (keccak256(bytes(campaign.whichStage)) == keccak256("stage1")) {
                stageAmount = campaign.amounts[stageIndex];
            } else {
                stageAmount = campaign.amounts[0]; // 5000000000000000000
            }

            require(
                campaign.totalFunds + msg.value <= stageAmount, // 3000000000000000000 + 2000000000000000000 <= 5000000000000000000
                "Contribution exceeds stage amount"
            );
            campaign.totalFunds = campaign.totalFunds + msg.value;
            // Update the contribution mapping based on the current stage
            if (
                keccak256(abi.encodePacked(campaign.whichStage)) ==
                keccak256("stage1")
            ) {
                if (campaign.stageContributions[msg.sender] == 0) {
                    User storage user = users[msg.sender];
                    user.campaignIndices.push(_campaignIndex);
                    campaign.contributors.push(msg.sender);
                }
                campaign.stageContributions[msg.sender] += msg.value;
            } else if (
                keccak256(abi.encodePacked(campaign.whichStage)) ==
                keccak256("stage2")
            ) {
                if (campaign.contributions[msg.sender] == 0) {
                    User storage user = users[msg.sender];
                    user.campaignIndices.push(_campaignIndex);
                    bool senderExists = false;
                    for (uint256 i = 0; i < campaign.contributors.length; i++) {
                        if (campaign.contributors[i] == msg.sender) {
                            senderExists = true;
                            break;
                        }
                    }
                    if (!senderExists) {
                        // Add msg.sender to contributors list if it doesn't already exist
                        campaign.contributors.push(msg.sender);
                    }
                }
                campaign.contributions[msg.sender] += msg.value;
            }
        } else {
            revert("Contribution not allowed in this stage");
        }
    }

    function startStage(uint256 _campaignIndex)
        external
        onlyAdmin
        onlyApprovedCampaign(_campaignIndex)
    {
        require(_campaignIndex < campaigns.length, "Invalid campaign index");

        Campaign storage campaign = campaigns[_campaignIndex];

        require(
            block.timestamp < campaign.campaignExpiry,
            "Stage Change not allowed, campaign has expired"
        );

        if (!campaign.stage1Completed || !campaign.stage2Completed) {
            // If neither stage is completed, check whichStage
            if (
                keccak256(abi.encodePacked(campaign.whichStage)) ==
                keccak256(abi.encodePacked(""))
            ) {
                // If whichStage is empty, start Stage 1
                campaign.status = CampaignStage.Stage1;
                campaign.whichStage = "stage1";
            } else if (
                keccak256(abi.encodePacked(campaign.whichStage)) ==
                keccak256(abi.encodePacked("stage1")) &&
                campaign.stage1Completed
            ) {
                // Move to Stage 2
                campaign.status = CampaignStage.Stage2;
                campaign.whichStage = "stage2";

                // Reset votedForStage for all contributors
                for (uint256 i = 0; i < campaign.contributors.length; i++) {
                    address contributor = campaign.contributors[i];
                    campaign.votedForStage[contributor] = false;
                }
            }
        } else {
            // Both stages completed, the campaign is already completed
            revert("Campaign already completed");
        }
    }

    function voteForStage(uint256 _campaignIndex, bool _accept) external {
        require(_campaignIndex < campaigns.length, "Invalid campaign index");
        require(_accept == true || _accept == false, "Invalid vote value");

        Campaign storage campaign = campaigns[_campaignIndex];

        require(
            campaign.status != CampaignStage.NotStarted &&
                campaign.status != CampaignStage.Completed,
            "Voting not allowed in this stage"
        );

        if (
            keccak256(abi.encodePacked(campaign.whichStage)) ==
            keccak256("stage1")
        ) {
            require(
                campaign.stageContributions[msg.sender] > 0,
                "Only contributors to Stage 1 can vote"
            );
        } else if (
            keccak256(abi.encodePacked(campaign.whichStage)) ==
            keccak256("stage2")
        ) {
            require(
                campaign.contributions[msg.sender] > 0,
                "Only contributors to Stage 2 can vote"
            );
        }

        require(
            !campaign.votedForStage[msg.sender],
            "You have already voted for the current stage"
        );

        uint256 stageIndex = getIndex(campaign.whichStage); // 2

        uint256 stageAmount;
        if (keccak256(bytes(campaign.whichStage)) == keccak256("stage1")) {
            stageAmount = campaign.amounts[stageIndex];
        } else {
            stageAmount = campaign.amounts[0]; // 5000000000000000000
        }

        require(
            campaign.totalFunds == stageAmount, // 3000000000000000000 + 2000000000000000000 <= 5000000000000000000
            "Voting Not Started"
        );

        campaign.votedForStage[msg.sender] = true;

        if (_accept) {
            campaign.stageVotesFor[campaign.status]++;
        } else {
            campaign.stageVotesAgainst[campaign.status]++;
        }
    }

    function getStageContributionsLength(uint256 _campaignIndex)
        public
        view
        returns (uint256)
    {
        require(_campaignIndex < campaigns.length, "Invalid campaign index");

        uint256 count = 0;
        Campaign storage campaign = campaigns[_campaignIndex];
        string memory currentStage = campaign.whichStage;

        if (keccak256(bytes(currentStage)) == keccak256(bytes("stage1"))) {
            for (uint256 i = 0; i < campaign.contributors.length; i++) {
                address contributor = campaign.contributors[i];
                if (campaign.stageContributions[contributor] > 0) {
                    count++;
                }
            }
        } else if (
            keccak256(bytes(currentStage)) == keccak256(bytes("stage2"))
        ) {
            for (uint256 i = 0; i < campaign.contributors.length; i++) {
                address contributor = campaign.contributors[i];
                if (campaign.contributions[contributor] > 0) {
                    count++;
                }
            }
        }
        return count;
    }

    function endStageVoting(uint256 _campaignIndex) external onlyAdmin {
        require(_campaignIndex < campaigns.length, "Invalid campaign index");

        Campaign storage campaign = campaigns[_campaignIndex];

        uint256 stageAmountTemp;
        if (keccak256(bytes(campaign.whichStage)) == keccak256("stage1")) {
            stageAmountTemp = campaign.amounts[1];
        } else {
            stageAmountTemp = campaign.amounts[0]; // 5000000000000000000
        }

        require(
            campaign.totalFunds == stageAmountTemp, // 3000000000000000000 + 2000000000000000000 <= 5000000000000000000
            "Target Not Reached"
        );

        require(
            campaign.paidfunds < stageAmountTemp,
            "Already Money Transfered"
        );

        uint256 votesForStage = campaign.stageVotesFor[campaign.status];
        uint256 votesAgainstStage = campaign.stageVotesAgainst[campaign.status];
        uint256 requiredVotes = getStageContributionsLength(_campaignIndex) / 2;

        require(
            votesForStage + votesAgainstStage > 0,
            "No votes received for the current stage"
        );

        if (
            votesForStage > votesAgainstStage && votesForStage >= requiredVotes
        ) {
            // Admin approves the current stage
            uint256 stageIndex = getIndex(campaign.whichStage);
            uint256 stageAmount = campaign.amounts[stageIndex];

            if (keccak256(bytes(campaign.whichStage)) == keccak256("stage1")) {
                // Transfer funds of Stage 1 to the creator
                uint256 stage1Funds = stageAmount - (stageAmount / 100); // platform fees
                payable(campaign.creator).transfer(stage1Funds);
                platformBalance = platformBalance + stageAmount / 100;
                campaign.paidfunds = campaign.paidfunds + stageAmount;
                campaign.stage1Completed = true;
            } else if (
                keccak256(bytes(campaign.whichStage)) == keccak256("stage2")
            ) {
                // Transfer remaining funds of Stage 2 to the creator
                uint256 remainingFunds = stageAmount - (stageAmount / 100); // platofrm fees
                payable(campaign.creator).transfer(remainingFunds);
                campaign.paidfunds = campaign.paidfunds + stageAmount;
                platformBalance = platformBalance + stageAmount / 100;
                campaign.stage2Completed = true;
                campaign.status = CampaignStage.Completed;
            }
            campaign.adminApproved = true;
            emit StageCompletion(uint256(campaign.status), _campaignIndex);
        } else {
            // Refund all contributors to the current stage
            refundContributors(_campaignIndex);
        }
    }

    function froceStopCampaign(uint256 _campaignIndex) external onlyAdmin{
         Campaign storage campaign = campaigns[_campaignIndex];
        string memory currentStage = campaign.whichStage;

        uint256 totalContributors = campaign.contributors.length;
        for (uint256 i = 0; i < totalContributors; i++) {
            address contributor = campaign.contributors[i];
            uint256 contribution = 0;

            if (keccak256(bytes(currentStage)) == keccak256(bytes("stage1"))) {
                contribution = campaign.stageContributions[contributor];
            } else if (
                keccak256(bytes(currentStage)) == keccak256(bytes("stage2"))
            ) {
                contribution = campaign.contributions[contributor];
            }

            if (contribution > 0) {
                payable(contributor).transfer(contribution);
                campaign.totalFunds -= contribution;
            }
        }
        campaign.whichStage = string(
            abi.encodePacked(campaign.whichStage, " Forced Stopped and Collected Money Refunded by Admin")
        );
    }

    function refundContributors(uint256 _campaignIndex) private {
        Campaign storage campaign = campaigns[_campaignIndex];
        string memory currentStage = campaign.whichStage;

        uint256 totalContributors = campaign.contributors.length;
        for (uint256 i = 0; i < totalContributors; i++) {
            address contributor = campaign.contributors[i];
            uint256 contribution = 0;

            if (keccak256(bytes(currentStage)) == keccak256(bytes("stage1"))) {
                contribution = campaign.stageContributions[contributor];
            } else if (
                keccak256(bytes(currentStage)) == keccak256(bytes("stage2"))
            ) {
                contribution = campaign.contributions[contributor];
            }

            if (contribution > 0) {
                payable(contributor).transfer(contribution);
                campaign.totalFunds -= contribution;
            }
        }
        campaign.whichStage = string(
            abi.encodePacked(campaign.whichStage, " failed")
        );
    }

    function approveCampaign(uint256 _campaignIndex) external onlyAdmin {
        require(_campaignIndex < campaigns.length, "Invalid campaign index");

        Campaign storage campaign = campaigns[_campaignIndex];

        campaign.adminApproved = true;
    }

    function isAdminApproved(uint256 _campaignIndex)
        external
        view
        returns (bool)
    {
        require(_campaignIndex < campaigns.length, "Invalid campaign index");

        Campaign storage campaign = campaigns[_campaignIndex];
        return campaign.adminApproved;
    }

    function withdrawPlatformFee() external onlyAdmin {
        require(platformBalance > 0, "Platform balance is zero");

        payable(admin).transfer(platformBalance);
        platformBalance = 0;
    }

    // function getNumberOfCampaigns() external view returns (uint256) {
    //     return campaigns.length;
    // }

    struct CampaignData {
        string name;
        uint256 id;
        string details;
        string thumbnailUrl;
        uint256[] amounts;
        uint256 totalFunds;
        CampaignStage status;
        string whichStage;
        bool stage1Completed;
        bool stage2Completed;
        address creator;
        bool adminApproved;
        string[] documentsLinks;
        uint256 campaignExpiry;
    }

    function getData() external view returns (CampaignData[] memory) {
        uint256 length = campaigns.length;
        CampaignData[] memory data = new CampaignData[](length);

        for (uint256 i = 0; i < length; i++) {
            Campaign storage campaign = campaigns[i];
            data[i] = CampaignData({
                name: campaign.name,
                id: i,
                details: campaign.details,
                thumbnailUrl: campaign.thumbnailUrl,
                amounts: campaign.amounts,
                totalFunds: campaign.totalFunds,
                status: campaign.status,
                whichStage: campaign.whichStage,
                stage1Completed: campaign.stage1Completed,
                stage2Completed: campaign.stage2Completed,
                creator: campaign.creator,
                adminApproved: campaign.adminApproved,
                documentsLinks: campaign.documentsLinks,
                campaignExpiry: campaign.campaignExpiry
            });
        }

        return data;
    }

    function getDataByCreator(address _creator)
        external
        view
        returns (CampaignData[] memory)
    {
        uint256 length = campaigns.length;
        uint256 count = 0;

        // Count the number of campaigns created by the given address
        for (uint256 i = 0; i < length; i++) {
            if (campaigns[i].creator == _creator) {
                count++;
            }
        }

        // Create an array to hold data for campaigns created by the given address
        CampaignData[] memory data = new CampaignData[](count);
        uint256 dataIndex = 0;

        // Populate data for campaigns created by the given address
        for (uint256 i = 0; i < length; i++) {
            Campaign storage campaign = campaigns[i];
            if (campaign.creator == _creator) {
                data[dataIndex] = CampaignData({
                    name: campaign.name,
                    id: i,
                    details: campaign.details,
                    thumbnailUrl: campaign.thumbnailUrl,
                    amounts: campaign.amounts,
                    totalFunds: campaign.totalFunds,
                    status: campaign.status,
                    whichStage: campaign.whichStage,
                    stage1Completed: campaign.stage1Completed,
                    stage2Completed: campaign.stage2Completed,
                    creator: campaign.creator,
                    adminApproved: campaign.adminApproved,
                    documentsLinks: campaign.documentsLinks,
                    campaignExpiry: campaign.campaignExpiry
                });
                dataIndex++;
            }
        }
        return data;
    }

    function getIndex(string memory stage) private pure returns (uint256) {
        if (keccak256(bytes(stage)) == keccak256("stage1")) {
            return 1;
        } else if (keccak256(bytes(stage)) == keccak256("stage2")) {
            return 2;
        }
        return 0;
    }

    // Define a struct to hold campaign data
    struct SingleData {
        string name;
        string details;
        string thumbnailUrl;
        uint256 campaignExpiry;
        string[] documentsLinks;
        uint256[] amounts;
        uint256 totalFunds;
        CampaignStage status;
        string whichStage;
        bool stage1Completed;
        bool stage2Completed;
        address creator;
        bool adminApproved;
    }

    // Define function to get basic data for a single campaign by index
    function getBasicCampaignData(uint256 index)
        external
        view
        returns (SingleData memory)
    {
        require(index < campaigns.length, "Invalid index");

        Campaign storage campaign = campaigns[index];

        return
            SingleData({
                name: campaign.name,
                details: campaign.details,
                thumbnailUrl: campaign.thumbnailUrl,
                amounts: campaign.amounts,
                totalFunds: campaign.totalFunds,
                status: campaign.status,
                whichStage: campaign.whichStage,
                stage1Completed: campaign.stage1Completed,
                stage2Completed: campaign.stage2Completed,
                creator: campaign.creator,
                adminApproved: campaign.adminApproved,
                documentsLinks: campaign.documentsLinks,
                campaignExpiry: campaign.campaignExpiry
            });
    }

    // Define function to get data for a single campaign by index
    function getCampaignContributorsList(uint256 index)
        external
        view
        returns (address[] memory)
    {
        require(index < campaigns.length, "Invalid index");

        Campaign storage campaign = campaigns[index];
        uint256 contributorsCount = campaign.contributors.length;

        address[] memory contributorsList = new address[](contributorsCount);

        for (uint256 i = 0; i < contributorsCount; i++) {
            contributorsList[i] = campaign.contributors[i];
        }

        return contributorsList;
    }

    function rejectCampaign(uint256 campaignIndex) external onlyAdmin {
        require(campaignIndex < campaigns.length, "Campaign does not exist");

        campaigns[campaignIndex].whichStage = "Admin Rejected";
        campaigns[campaignIndex].adminApproved = false;
    }

    function getUserCampaignIndices(address _user)
        public
        view
        returns (uint256[] memory)
    {
        return users[_user].campaignIndices;
    }

    struct ContributorsData {
        uint256 stage1donation;
        uint256 stage2donation;
        bool voted;
        uint256 votedFor;
        uint256 votedAgainst;
        uint256 numberOfContributors;
        // uint256[] extraDetails;
    }

    function getCampaignsByContributor(address _address, uint256 _campaignIndex)
        external
        view
        returns (ContributorsData[] memory)
    {
        require(_campaignIndex < campaigns.length, "Invalid campaign index");

        // Create a dynamic array for contributors' data
        ContributorsData[] memory data = new ContributorsData[](1);

        // Populate the data array with contributions
        Campaign storage campaign = campaigns[_campaignIndex];

        // Create a ContributorsData struct and assign values to its properties
        ContributorsData memory contributorData;
        contributorData.stage1donation = campaign.stageContributions[_address];
        contributorData.stage2donation = campaign.contributions[_address];
        contributorData.voted = campaign.votedForStage[_address] ? true : false;
        contributorData.votedFor = campaign.stageVotesFor[campaign.status];
        contributorData.votedAgainst = campaign.stageVotesAgainst[
            campaign.status
        ];
        contributorData.numberOfContributors = getStageContributionsLength(
            _campaignIndex
        );

        data[0] = contributorData;
        // Return the dynamic array of contributors' data
        return data;
    }

    function isContributor(address _address, uint256 campaignIndex)
        internal
        view
        returns (bool)
    {
        Campaign storage campaign = campaigns[campaignIndex];
        if (campaign.contributors.length > 0) {
            for (uint256 i = 0; i < campaign.contributors.length; i++) {
                if (campaign.contributors[i] == _address) {
                    return true;
                }
            }
        }
        return false;
    }
}
