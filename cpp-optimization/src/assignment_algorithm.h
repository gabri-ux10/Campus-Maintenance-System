#pragma once

#include <vector>

namespace campusfix {

struct AssignmentCandidateSignal {
    int active_open_tickets = 0;
    int same_domain_resolved_tickets = 0;
    int same_building_resolved_tickets = 0;
    int recent_resolved_tickets = 0;
};

double ScoreCandidate(const AssignmentCandidateSignal& signal);

std::vector<double> ScoreCandidates(const std::vector<AssignmentCandidateSignal>& candidates);

}  // namespace campusfix
