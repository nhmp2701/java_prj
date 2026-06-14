package edu.uth.manga.task;

import edu.uth.manga.entity.Chapter;
import edu.uth.manga.enums.ChapterStatus;
import edu.uth.manga.repository.ChapterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Khai báo thư viện log
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional; // Khai báo Transactional

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class PublishScheduleTask {

    private final ChapterRepository chapterRepository;

    @Transactional
    @Scheduled(fixedRate = 60000)
    public void autoPublishChapters() {
        LocalDateTime now = LocalDateTime.now();

        List<Chapter> chapters = chapterRepository
                .findByStatusAndScheduledPublishAtBefore(ChapterStatus.SCHEDULED, now);

        if (!chapters.isEmpty()) {
            for (Chapter chapter : chapters) {
                chapter.setStatus(ChapterStatus.PUBLISHED);
            }
            chapterRepository.saveAll(chapters);

            // Dùng Log chuyên nghiệp thay cho System.out.println
            log.info("Đã tự động xuất bản {} chương truyện thành công!", chapters.size());
        }
    }
}