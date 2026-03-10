#include "assignment_algorithm.h"

#include <cmath>

namespace campusfix {

namespace {

constexpr double kWorkloadWeight = 55.0;
constexpr double kServiceDomainWeight = 12.0;
constexpr double kBuildingWeight = 7.5;
constexpr double kRecentResolutionWeight = 10.0;

}  // namespace

double ScoreCandidate(const AssignmentCandidateSignal& signal) {
    const double workload_score = kWorkloadWeight / (1.0 + static_cast<double>(signal.active_open_tickets));
    const double domain_score =
        kServiceDomainWeight * std::log1p(static_cast<double>(signal.same_domain_resolved_tickets));
    const double building_score =
        kBuildingWeight * std::log1p(static_cast<double>(signal.same_building_resolved_tickets));
    const double recent_score =
        kRecentResolutionWeight * std::log1p(static_cast<double>(signal.recent_resolved_tickets));
    return workload_score + domain_score + building_score + recent_score;
}

std::vector<double> ScoreCandidates(const std::vector<AssignmentCandidateSignal>& candidates) {
    std::vector<double> scores;
    scores.reserve(candidates.size());
    for (const AssignmentCandidateSignal& candidate : candidates) {
        scores.push_back(ScoreCandidate(candidate));
    }
    return scores;
}

}  // namespace campusfix
