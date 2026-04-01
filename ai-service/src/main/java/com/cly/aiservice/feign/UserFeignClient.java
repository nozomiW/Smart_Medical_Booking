package com.cly.aiservice.feign;

import com.cly.aiservice.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

/**
 * 用户服务 Feign 客户端
 */
@FeignClient(name = "user-service")
public interface UserFeignClient {

    /**
     * 获取当前用户的就诊人列表
     */
    @GetMapping("/user/patient/list")
    List<PatientDTO> getPatients(@RequestHeader("X-User-Id") String userId);

    /**
     * 就诊人 DTO
     */
    class PatientDTO {
        private String id;
        private String userId;
        private String name;
        private String idCard;
        private Integer gender;
        private String birthDate;
        private String phone;
        private Integer isDefault;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getIdCard() { return idCard; }
        public void setIdCard(String idCard) { this.idCard = idCard; }
        public Integer getGender() { return gender; }
        public void setGender(Integer gender) { this.gender = gender; }
        public String getBirthDate() { return birthDate; }
        public void setBirthDate(String birthDate) { this.birthDate = birthDate; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public Integer getIsDefault() { return isDefault; }
        public void setIsDefault(Integer isDefault) { this.isDefault = isDefault; }
    }
}
