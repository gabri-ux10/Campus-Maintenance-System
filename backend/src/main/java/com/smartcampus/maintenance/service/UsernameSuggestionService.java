package com.smartcampus.maintenance.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class UsernameSuggestionService {

    public List<String> generate(String preferredUsername, String fullName, int limit) {
        String base = sanitizeBase(preferredUsername, fullName);
        Set<String> suggestions = new LinkedHashSet<>();

        suggestions.add(base + "_01");
        suggestions.add(base + "_02");
        suggestions.add(base + "_admin");
        suggestions.add(base + "_staff");

        if (StringUtils.hasText(fullName)) {
            String initials = fullName.trim()
                    .toLowerCase(Locale.ROOT)
                    .replaceAll("[^a-z\\s]", "")
                    .replaceAll("\\s+", " ")
                    .strip()
                    .replace(" ", "");
            if (initials.length() >= 2) {
                suggestions.add(base + "_" + initials.substring(0, Math.min(3, initials.length())));
            }
        }

        for (int i = 11; i <= 99 && suggestions.size() < limit * 2; i++) {
            suggestions.add(base + i);
        }

        List<String> output = new ArrayList<>(limit);
        for (String value : suggestions) {
            if (output.size() >= limit) {
                break;
            }
            if (value.length() <= 50) {
                output.add(value);
            }
        }
        return output;
    }

    private String sanitizeBase(String preferredUsername, String fullName) {
        String source = StringUtils.hasText(preferredUsername) ? preferredUsername : fullName;
        if (!StringUtils.hasText(source)) {
            return "campus_user";
        }
        String cleaned = source.trim()
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9._-]", "_")
                .replaceAll("_+", "_");
        cleaned = cleaned.replaceAll("^[._-]+|[._-]+$", "");
        if (cleaned.length() < 3) {
            cleaned = (cleaned + "_user");
        }
        if (cleaned.length() > 24) {
            cleaned = cleaned.substring(0, 24);
        }
        return cleaned;
    }
}
