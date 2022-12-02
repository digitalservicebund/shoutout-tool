
const Session = function(sessionData) {
    this.data = sessionData;
    this.retroSubmissions = [];
    this.guests = [];
};

Session.prototype = {
    handleRetroSubmission: function(submissionData) {
        this.retroSubmissions.push(submissionData)
    },
    addGuest: function(guest) {
      this.guests.push(guest);
    },
    addReactionToSubmission: function(submissionId) {
        this.retroSubmissions[submissionId].reactionCount ++;
    },
};

module.exports = Session;
