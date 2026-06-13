package service;

import edu.uth.manga.entity.Asset;
import edu.uth.manga.entity.User;
import edu.uth.manga.enums.AssetStatus;
import edu.uth.manga.repository.AssetRepository;
import edu.uth.manga.repository.ReviewRepository;
import edu.uth.manga.repository.UserRepository;
import edu.uth.manga.service.impl.AssetServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AssetServiceTest {

    @Mock
    private AssetRepository assetRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private AssetServiceImpl assetService;

    @Test
    void testApproveAsset_Success() {
        // Chuẩn bị dữ liệu giả (Mock data)
        User approver = new User();
        approver.setId(1L);

        Asset asset = new Asset();
        asset.setId(10L);
        asset.setStatus(AssetStatus.PENDING);

        when(assetRepository.findById(10L)).thenReturn(Optional.of(asset));
        when(userRepository.findById(1L)).thenReturn(Optional.of(approver));
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);

        // Thực thi
        var result = assetService.approveAsset(10L, "Duyệt bản vẽ tốt", 1L);

        // Kiểm tra kết quả
        assertEquals("APPROVED", result.getStatus());
    }
}