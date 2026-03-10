#include "assignment_algorithm.h"

#include <iomanip>
#include <iostream>
#include <vector>

int main() {
    const std::vector<campusfix::AssignmentCandidateSignal> candidates = {
        {2, 5, 3, 4},
        {1, 2, 1, 2},
        {4, 6, 0, 6},
    };

    const std::vector<double> scores = campusfix::ScoreCandidates(candidates);
    std::cout << "CampusFix native assignment benchmark" << '\n';
    for (std::size_t index = 0; index < scores.size(); ++index) {
        std::cout << "candidate[" << index << "] score=" << std::fixed << std::setprecision(2) << scores[index]
                  << '\n';
    }
    return 0;
}
