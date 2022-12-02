
const Session = function(sessionData) {
    this.data = sessionData;
    this.submissions = [];
    this.guests = [];
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
};

module.exports = Session;
