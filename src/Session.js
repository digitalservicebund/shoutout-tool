
const Session = function(sessionData) {
    this.data = sessionData;
    this.submissions = [];
    this.guests = [];
    this.additionalCategories = [];
};

Session.prototype = {
    handleSubmission: function(submissionData) {
        this.submissions.push(submissionData)
    },
    addGuest: function(guest) {
      this.guests.push(guest);
    },
    addReactionToSubmission: function(submissionId) {
        this.submissions[submissionId].reactionCount ++;
    },
    addAdditionalCategory: function(category) {
        this.additionalCategories.push(category);
    }
};

module.exports = Session;
